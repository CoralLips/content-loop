#!/usr/bin/env node
// video-loop/bin/verify-narration.mjs
// 按 config.verification.narration 规则检查 clean 口稿 md 的「听懂友好度」。
//
// 检查规则：
//   R0 视觉符号（——／→「」《》 等）不能出现在旁白里（TTS 读不出）
//   R1 unwhitelisted_terms 必须在 ±context_window 字内有解释标记
//        v2 额外允许：frontmatter 标注 annotation 覆盖（画面底部注解）
//   R2 句子平均长度 ≤ preset.max_avg_sentence_chars
//   R3 单句长度 ≤ preset.max_single_sentence_chars
//   R4 代词密度（它/这个/那个）不能过高
//   R5 连接词密度 ≥ 1 个 / preset.min_connector_per_n_sentences 句（v2 更严）
//   R6 段落长度 ≤ preset.max_paragraph_chars
//
// 用法: node bin/verify-narration.mjs <clean.md> [--preset v1|v2]

import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

const CONFIG = JSON.parse(readFileSync(new URL('../config.json', import.meta.url), 'utf8'));
const CFG = CONFIG.verification?.narration || {};

const argv = process.argv.slice(2);
const file = argv[0];
if (!file) { console.error('usage: verify-narration.mjs <clean.md> [--preset v1|v2]'); process.exit(2); }

const presetIdx = argv.indexOf('--preset');
const presetName = presetIdx >= 0 ? argv[presetIdx + 1] : 'v1';
const PRESET = CFG.presets?.[presetName] || {};
if (!CFG.presets?.[presetName]) {
  console.error(`[verify-narration] 未知 preset "${presetName}"，可选：${Object.keys(CFG.presets || {}).join(', ')}`);
  process.exit(2);
}

const raw = await readFile(file, 'utf8');

// 解析 frontmatter，提取 annotation 声明的术语（v2 专用）
function parseFrontmatter(md) {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!m) return { annotatedTerms: new Set() };
  const fm = m[1];
  const ann = fm.match(/annotations?:\s*\[([^\]]+)\]/);
  if (!ann) return { annotatedTerms: new Set() };
  const terms = ann[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  return { annotatedTerms: new Set(terms) };
}

const { annotatedTerms } = parseFrontmatter(raw);

// Strip md: frontmatter, headers, hrules, blockquotes, emphasis
function strip(md) {
  const parts = md.split(/^---\s*$/m);
  const body = parts.length >= 3 ? parts.slice(2).join('---') : md;
  return body
    .split('\n')
    .filter(l => !/^#+\s/.test(l))
    .filter(l => !/^---+\s*$/.test(l.trim()))
    .filter(l => !/^>\s/.test(l))
    .join('\n')
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/\`([^`]+)\`/g, '$1')
    .trim();
}

const clean = strip(raw);
const warnings = [];
const infos = [];

// R0: 视觉符号
const forbidden = CFG.visual_symbols_forbidden || ['——', '／', '→', '「', '」', '《', '》'];
for (const sym of forbidden) {
  let idx = 0, hits = 0;
  while ((idx = clean.indexOf(sym, idx)) !== -1) { hits++; idx += sym.length; }
  if (hits) warnings.push(`R0 视觉符号 "${sym}" 出现 ${hits} 次（TTS 读不出，必须删）`);
}

// R1: Unwhitelisted terms must have explanation nearby (or be annotated in v2)
const terms = CFG.unwhitelisted_terms || [];
const window = CFG.term_context_window ?? 50;
const markers = CFG.definition_markers || ['叫做', '叫', '就是', '意思是', '换句话说'];
const allowAnnotation = !!PRESET.annotation_tolerated_terms;

// 术语只要全文任一出现位置 ±window 字内有定义标记即可（先解释或后解释都算数）
for (const term of terms) {
  const firstIdx = clean.indexOf(term);
  if (firstIdx === -1) continue;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const allMatches = [...clean.matchAll(new RegExp(escaped, 'g'))];
  const occurrences = allMatches.length;
  const hasExplanationAnywhere = allMatches.some(m => {
    const idx = m.index;
    const context = clean.slice(Math.max(0, idx - window), idx) +
                    clean.slice(idx + term.length, Math.min(clean.length, idx + term.length + window));
    return markers.some(mk => context.includes(mk));
  });
  if (!hasExplanationAnywhere) {
    if (allowAnnotation && annotatedTerms.has(term)) {
      infos.push(`R1 术语 "${term}"（${occurrences}次）无旁白铺垫，frontmatter annotations 已声明 → 必须在 tsx 加 Annotation 组件`);
    } else {
      const hint = allowAnnotation ? '（或 frontmatter 加 annotations: ["' + term + '"]）' : '';
      warnings.push(`R1 术语 "${term}"（共 ${occurrences} 次）全文无任何位置有定义标记（±${window} 字）${hint}`);
    }
  } else {
    infos.push(`R1 术语 "${term}" 有定义标记 ✓（共 ${occurrences} 次）`);
  }
}

// R2/R3: Sentence length
const sentences = clean.split(/[。！？!?]+/).map(s => s.trim()).filter(Boolean);
const avgLen = sentences.length ? sentences.reduce((a, s) => a + s.length, 0) / sentences.length : 0;
const maxAvg = PRESET.max_avg_sentence_chars ?? 40;
const maxSingle = PRESET.max_single_sentence_chars ?? 80;

infos.push(`[preset=${presetName}] 句数 ${sentences.length}，平均 ${avgLen.toFixed(1)} 字（上限 ${maxAvg}），单句上限 ${maxSingle}`);
if (avgLen > maxAvg) warnings.push(`R2 平均句长 ${avgLen.toFixed(1)} > ${maxAvg}`);

const longSentences = sentences.map((s, i) => ({ i, s, len: s.length })).filter(x => x.len > maxSingle);
for (const ls of longSentences) {
  warnings.push(`R3 第 ${ls.i + 1} 句过长 (${ls.len} 字): "${ls.s.slice(0, 40)}..."`);
}

// R4: Pronoun density
const pronouns = CFG.pronoun_watch || ['它', '这个', '那个'];
let pronounCount = 0;
for (const p of pronouns) pronounCount += (clean.match(new RegExp(p, 'g')) || []).length;
const density = pronounCount / (clean.length / 500);
infos.push(`代词 ${pronounCount} 个，密度 ${density.toFixed(1)} 个/500字`);
if (density > 8) warnings.push(`R4 代词密度偏高 ${density.toFixed(1)} 个/500字（建议 ≤ 8）`);

// R5: Connector density
const connectors = CFG.connectors || ['所以', '但是', '因为', '也就是说', '换句话说'];
const minConnectorPerN = PRESET.min_connector_per_n_sentences ?? 2;
let connectorCount = 0;
for (const c of connectors) connectorCount += (clean.match(new RegExp(c, 'g')) || []).length;
const perNSentences = sentences.length ? (connectorCount / sentences.length) * minConnectorPerN : 0;
infos.push(`连接词 ${connectorCount} 个，折合每 ${minConnectorPerN} 句 ${perNSentences.toFixed(2)} 个（要求 ≥ 1）`);
if (sentences.length >= 10 && perNSentences < 1) {
  warnings.push(`R5 连接词密度不足：每 ${minConnectorPerN} 句仅 ${perNSentences.toFixed(2)} 个（${presetName} 要求 ≥ 1 个/${minConnectorPerN}句，冷峻≠断裂）`);
}

// R6: Paragraph length
const paragraphs = clean.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
const maxPara = PRESET.max_paragraph_chars ?? 150;
const longParas = paragraphs.map((p, i) => ({ i, p, len: p.length })).filter(x => x.len > maxPara);
for (const lp of longParas) {
  warnings.push(`R6 第 ${lp.i + 1} 段过长 (${lp.len} 字，上限 ${maxPara})：拆开`);
}

// Report
console.log('='.repeat(50));
console.log(`[verify-narration] ${file} · preset=${presetName}`);
infos.forEach(i => console.log(`  ${i}`));
console.log('');

if (warnings.length === 0) {
  console.log('✅ 全部通过');
} else {
  console.log(`⚠️  ${warnings.length} 条警告:`);
  warnings.forEach(w => console.log(`  - ${w}`));
}

process.exit(warnings.length ? 2 : 0);
