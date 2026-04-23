#!/usr/bin/env node
// video-loop/bin/extract-narration.mjs
// 从 publish-queue/published/{ep}.md 自动产出结构化剧本草稿，供人工精修 v1/v2 口稿 + TSX shot 设计。
//
// 产出不是最终口稿 — 是候选素材清单：
//   - 每节的 key_phrases（加粗短语）
//   - 每节的 short_sentences（≤25 字，可做 hero 候选）
//   - 每节的 long_quotes（可压缩为旁白的长句）
//   - glossary（术语 + 首次出现位置 + 频率）
//   - v2 5 Act 建议（基于关键词匹配 section heading）
//
// 用法:
//   node bin/extract-narration.mjs <published.md>                      # 输出到 shots/{ep}-draft.json
//   node bin/extract-narration.mjs <published.md> -o <out.json>
//   node bin/extract-narration.mjs <published.md> --md                 # 额外输出 shots/{ep}-draft.md（人读版）

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const argv = process.argv.slice(2);
if (!argv[0] || argv[0].startsWith('-')) {
  console.error('usage: extract-narration.mjs <published.md> [-o out.json] [--md]');
  console.error('  默认输出到 $TEMP/video-loop-extract/ (不落项目目录)');
  console.error('  明确落项目目录：-o shots/{ep}-draft.json');
  process.exit(2);
}
const inputPath = argv[0];
const outIdx = argv.indexOf('-o');
const alsoMd = argv.includes('--md');

const raw = await readFile(inputPath, 'utf8');

// ---- parse frontmatter ----
function parseFrontmatter(md) {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!m) return { fm: {}, body: md };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return { fm, body: md.slice(m[0].length) };
}

const { fm, body } = parseFrontmatter(raw);

// ---- strip code blocks + tables (not narration material) ----
function stripNonProse(md) {
  return md
    .replace(/```[\s\S]*?```/g, '')          // fenced code
    .replace(/`[^`]+`/g, '')                  // inline code
    .replace(/^\|.*\|$/gm, '')                // table rows
    .replace(/^---+$/gm, '')                  // hr
    .replace(/^>\s?/gm, '');                  // blockquote prefix
}

// ---- split by heading ----
function splitByHeading(md) {
  const sections = [];
  let current = { heading: null, level: 0, body: '' };
  for (const line of md.split('\n')) {
    const h = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (h) {
      if (current.heading !== null || current.body.trim()) sections.push(current);
      current = { heading: h[2], level: h[1].length, body: '' };
    } else {
      current.body += line + '\n';
    }
  }
  if (current.heading !== null || current.body.trim()) sections.push(current);
  return sections;
}

// ---- extract: bold phrases ----
function extractBold(text) {
  const out = [];
  const re = /\*\*([^*\n]+?)\*\*/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const phrase = m[1].trim();
    if (phrase.length >= 2 && phrase.length <= 40) out.push(phrase);
  }
  return out;
}

// ---- sentence split (中文 + 西文) ----
function splitSentences(text) {
  // 去加粗 / 斜体 / 链接标记，保留文字
  const clean = text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return [];
  return clean.split(/(?<=[。？！?!；;])/).map(s => s.trim()).filter(s => s.length > 0);
}

// ---- char count (中文 1, ascii word ≈ 2 chars 近似) ----
function charCount(s) {
  // 粗略：中文字 + 数字 + 英文词每个算 1 char
  return [...s].filter(c => !/\s/.test(c)).length;
}

// ---- v2 act keyword matching ----
const V2_ACT_KEYWORDS = [
  { act: 1, name: '谜面',     kws: ['谜', '难题', '吵', '问题', '钩子', '第一', '开头'] },
  { act: 2, name: '常识错在哪', kws: ['常识', '以为', '直觉', '过去', '经典', '传统', '1948', '1980', 'Shannon', 'Searle', '哲学', '老'] },
  { act: 3, name: '新工具',   kws: ['新', '工具', '定义', '公式', '判据', '本月', '论文', '这个月', '方法', '提出'] },
  { act: 4, name: '谜底',     kws: ['谜底', '结论', '答案', '解决', '瓦解', '证明', '定理', '因此', '所以', '核心'] },
  { act: 5, name: '余韵',     kws: ['余韵', '自己', '你', '生活', '笔记', '原则', '应用', '意义', '最后', '结尾'] },
];

function suggestV2Acts(sections) {
  const suggestions = [[], [], [], [], []]; // index 0..4 → Act 1..5
  for (const sec of sections) {
    if (!sec.heading) continue;
    const haystack = sec.heading + ' ' + sec.body;
    const scores = V2_ACT_KEYWORDS.map(({ act, kws }) => {
      let s = 0;
      for (const k of kws) if (haystack.includes(k)) s++;
      return { act, s };
    });
    scores.sort((a, b) => b.s - a.s);
    if (scores[0].s > 0) suggestions[scores[0].act - 1].push(sec.heading);
  }
  return suggestions;
}

// ---- main ----
const cleaned = stripNonProse(body);
const sections = splitByHeading(cleaned).filter(s => s.body.trim() || s.heading);

const allBold = [];
const glossary = new Map(); // term → { firstSection, freq }

const sectionData = sections.map((sec, secIdx) => {
  const bold = extractBold(sec.body);
  for (const p of bold) {
    allBold.push(p);
    if (!glossary.has(p)) glossary.set(p, { firstSection: secIdx, freq: 1 });
    else glossary.get(p).freq++;
  }
  const sentences = splitSentences(sec.body);
  const shortSentences = sentences.filter(s => {
    const n = charCount(s);
    return n >= 4 && n <= 25;
  });
  const longQuotes = sentences.filter(s => {
    const n = charCount(s);
    return n >= 30 && n <= 80;
  });
  return {
    idx: secIdx,
    heading: sec.heading,
    level: sec.level,
    body_chars: charCount(sec.body),
    sentence_count: sentences.length,
    key_phrases: [...new Set(bold)],
    short_sentences: shortSentences.slice(0, 6),    // 节选前 6 条，避免爆炸
    long_quotes: longQuotes.slice(0, 3),
  };
});

// glossary — 只保留出现过 ≥ 2 次 或 heading 中出现的加粗
const glossaryArr = [...glossary.entries()]
  .map(([term, meta]) => ({ term, ...meta }))
  .filter(g => g.freq >= 2 || sections.some(s => s.heading && s.heading.includes(g.term)))
  .sort((a, b) => b.freq - a.freq);

// v2 act suggestions
const v2Suggestions = suggestV2Acts(sections);

const output = {
  episode: fm.episode || path.basename(inputPath, '.md').replace(/^(\d+)[-_].*/, '$1'),
  source: inputPath.replace(/\\/g, '/'),
  generated: new Date().toISOString().slice(0, 10),
  frontmatter: fm,
  stats: {
    article_chars: charCount(body),
    sections: sections.length,
    bolded_total: allBold.length,
    bolded_unique: new Set(allBold).size,
    glossary_size: glossaryArr.length,
  },
  sections: sectionData,
  glossary: glossaryArr,
  v2_act_suggestions: V2_ACT_KEYWORDS.map(({ act, name }, i) => ({
    act,
    name,
    candidate_sections: v2Suggestions[i],
  })),
  notes: [
    'short_sentences = ≤25 字候选，可做 hero text 或单句画面',
    'long_quotes = 30-80 字候选，可压缩为 v2 旁白（目标 ≤25 字/句）',
    'glossary = 出现 ≥2 次或上过 heading 的加粗短语，v2 Annotation 组件候选',
    'v2_act_suggestions = 基于关键词匹配，仅供参考，实际 5 Act 切分请人工确定',
  ],
};

// ---- write ----
const ep = output.episode;
const defaultOut = path.join(tmpdir(), 'video-loop-extract', `${ep}-draft.json`);
const outPath = outIdx >= 0 ? argv[outIdx + 1] : defaultOut;

await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`[extract-narration] wrote ${outPath}`);
console.log(`  sections: ${output.stats.sections}, bold unique: ${output.stats.bolded_unique}, glossary: ${output.stats.glossary_size}`);

if (alsoMd) {
  const mdOut = outPath.replace(/\.json$/, '.md');
  const lines = [];
  lines.push(`# ${ep} — 剧本拆解草稿`);
  lines.push('');
  lines.push(`来源：\`${output.source}\` · 生成于 ${output.generated}`);
  lines.push('');
  lines.push(`**统计**：${output.stats.sections} 节 · ${output.stats.bolded_unique} 个独立加粗短语 · ${output.stats.glossary_size} 个候选术语`);
  lines.push('');

  lines.push('## 候选术语表（Annotation 候选）');
  lines.push('');
  for (const g of glossaryArr.slice(0, 15)) {
    lines.push(`- **${g.term}** — 首现第 ${g.firstSection} 节 · 出现 ${g.freq} 次`);
  }
  lines.push('');

  lines.push('## v2 五幕建议（仅参考）');
  lines.push('');
  for (const s of output.v2_act_suggestions) {
    lines.push(`### Act ${s.act} · ${s.name}`);
    if (s.candidate_sections.length === 0) {
      lines.push('_未匹配到明确章节，需人工挑选_');
    } else {
      for (const h of s.candidate_sections) lines.push(`- ${h}`);
    }
    lines.push('');
  }

  lines.push('## 章节素材清单');
  lines.push('');
  for (const sec of sectionData) {
    const heading = sec.heading ? `${'#'.repeat(Math.min(sec.level + 1, 6))} ${sec.heading}` : `### (前言)`;
    lines.push(heading);
    lines.push('');
    lines.push(`_${sec.body_chars} 字 · ${sec.sentence_count} 句_`);
    lines.push('');
    if (sec.key_phrases.length) {
      lines.push(`**关键短语**：${sec.key_phrases.map(p => `\`${p}\``).join(' · ')}`);
      lines.push('');
    }
    if (sec.short_sentences.length) {
      lines.push('**短句候选（hero / 单句画面）**：');
      for (const s of sec.short_sentences) lines.push(`- ${s}`);
      lines.push('');
    }
    if (sec.long_quotes.length) {
      lines.push('**长句候选（待压缩为旁白）**：');
      for (const s of sec.long_quotes) lines.push(`> ${s}`);
      lines.push('');
    }
  }

  await writeFile(mdOut, lines.join('\n'), 'utf8');
  console.log(`[extract-narration] wrote ${mdOut}`);
}
