#!/usr/bin/env node
// video-loop/bin/source-materials.mjs
// 从 publish-queue/published/{ep}.md 扒外部引用（arxiv / doi / 一般链接），
// 生成 source/{ep}-materials.md 半自动素材索引页 + 空的 figures 目录。
//
// 半自动：不下载图片（arxiv 的图要从 PDF 抠或从 ar5iv 截，不稳定）。
// 自动：扒链接、生成 ar5iv / pdf 直链、提示保存位置。
//
// 用法:
//   node bin/source-materials.mjs <published.md>
//   node bin/source-materials.mjs <published.md> -o <out.md>

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const argv = process.argv.slice(2);
if (!argv[0] || argv[0].startsWith('-')) {
  console.error('usage: source-materials.mjs <published.md> [-o out.md]');
  console.error('  默认输出到 $TEMP/video-loop-source/ (不落项目目录)');
  console.error('  明确落项目目录：-o source/{ep}-materials.md');
  process.exit(2);
}
const inputPath = argv[0];
const outIdx = argv.indexOf('-o');

const raw = await readFile(inputPath, 'utf8');
const ep = path.basename(inputPath, '.md').replace(/^(\d+[a-z]*)[-_].*/, '$1');

// ---- link extractors ----
const arxivRe = /https?:\/\/arxiv\.org\/(?:abs|pdf)\/([\d.]+?)(?:v\d+)?(?:\.pdf)?(?=[\s)"'<]|$)/gi;
const ar5ivRe = /https?:\/\/ar5iv\.(?:labs\.)?arxiv\.org\/html\/([\d.]+)/gi;
const doiRe = /https?:\/\/(?:dx\.)?doi\.org\/([^\s)"'<]+)/gi;
const mdLinkRe = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
const bareUrlRe = /(?<![(\[])\bhttps?:\/\/[^\s)"']+/g;

const arxivIds = new Set();
const doiIds = new Set();
const otherLinks = new Set();

// arxiv
for (const m of raw.matchAll(arxivRe)) arxivIds.add(m[1]);
for (const m of raw.matchAll(ar5ivRe)) arxivIds.add(m[1]);

// doi
for (const m of raw.matchAll(doiRe)) doiIds.add(m[1].replace(/[.,);]+$/, ''));

// markdown 链接里的 context（用来给每个链接标题）
const linkContext = new Map(); // url → surrounding text
for (const m of raw.matchAll(mdLinkRe)) {
  linkContext.set(m[2].replace(/[.,);]+$/, ''), m[1]);
}

// 扒所有 URL 作为兜底，但排除 arxiv/doi 已识别的
for (const m of raw.matchAll(bareUrlRe)) {
  const url = m[0].replace(/[.,);]+$/, '');
  if (arxivRe.test(url) || ar5ivRe.test(url) || doiRe.test(url)) continue;
  if (url.includes('arxiv.org') || url.includes('doi.org')) continue;
  otherLinks.add(url);
}

// ---- find a hook sentence for each arxiv id (first paragraph containing the URL) ----
function findContext(pattern) {
  const lines = raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      // 取该行 + 上下共 3 行
      const start = Math.max(0, i - 1);
      const end = Math.min(lines.length, i + 2);
      return lines.slice(start, end).join(' ').replace(/\s+/g, ' ').slice(0, 200);
    }
  }
  return '';
}

// ---- generate output ----
const lines = [];
lines.push(`# ${ep} — 素材索引`);
lines.push('');
lines.push(`来源：\`${inputPath.replace(/\\/g, '/')}\`  · 生成于 ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push(`**建议本地存放目录**：\`source/${ep}-figures/\`（脚本已建好）`);
lines.push('');

lines.push(`## 概览`);
lines.push('');
lines.push(`- arxiv: **${arxivIds.size}** 篇`);
lines.push(`- DOI: **${doiIds.size}** 篇`);
lines.push(`- 其他链接: **${otherLinks.size}** 条`);
lines.push('');

if (arxivIds.size > 0) {
  lines.push(`## arxiv 论文`);
  lines.push('');
  for (const id of arxivIds) {
    const ctx = findContext(new RegExp(id.replace(/\./g, '\\.')));
    lines.push(`### arxiv:${id}`);
    lines.push('');
    if (ctx) {
      lines.push(`> 上下文：${ctx}`);
      lines.push('');
    }
    lines.push(`- **ar5iv（带图浏览）**：https://ar5iv.labs.arxiv.org/html/${id}`);
    lines.push(`- **原 PDF**：https://arxiv.org/pdf/${id}.pdf`);
    lines.push(`- **摘要页**：https://arxiv.org/abs/${id}`);
    lines.push(`- **Semantic Scholar**：https://www.semanticscholar.org/arxiv/${id}`);
    lines.push('');
    lines.push(`**建议素材**（挑 2-3 张最有张力的，右键保存到 \`source/${ep}-figures/\`）：`);
    lines.push('');
    lines.push(`- [ ] \`paper-${id}-cover.png\`（论文首页截图，权威感）`);
    lines.push(`- [ ] \`paper-${id}-fig1.png\`（Figure 1，通常是方法示意）`);
    lines.push(`- [ ] \`paper-${id}-thm.png\`（核心定理截图）`);
    lines.push(`- [ ] \`paper-${id}-table.png\`（实验结果表）`);
    lines.push('');
  }
}

if (doiIds.size > 0) {
  lines.push(`## DOI 引用`);
  lines.push('');
  for (const id of doiIds) {
    const ctx = findContext(new RegExp(id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    lines.push(`### doi:${id}`);
    lines.push('');
    if (ctx) {
      lines.push(`> 上下文：${ctx}`);
      lines.push('');
    }
    lines.push(`- **DOI 解析**：https://doi.org/${id}`);
    lines.push(`- **OpenAlex**：https://api.openalex.org/works/doi:${id}`);
    lines.push('');
  }
}

if (otherLinks.size > 0) {
  lines.push(`## 其他外部链接`);
  lines.push('');
  for (const url of otherLinks) {
    const title = linkContext.get(url);
    lines.push(`- ${title ? `[${title}](${url})` : url}`);
  }
  lines.push('');
}

lines.push('---');
lines.push('');
lines.push('## 工作流提示');
lines.push('');
lines.push('1. 打开上面的 ar5iv 链接，浏览 **Figure 1-3 + 核心定理区**，挑最有视觉张力的');
lines.push('2. 右键 `另存图片为`，保存到 `source/{ep}-figures/`，用建议的文件名');
lines.push('3. 在 TSX scene 里用 `<Img src={staticFile(\'{ep}-figures/xxx.png\')} />` 引入（需先移到 `public/`）');
lines.push('4. v2 冷峻美学建议：一集不超过 2 张外部图，其余用文字 + 符号');
lines.push('5. 论文公式整洁，可考虑用 ar5iv 的 KaTeX 渲染截图（比 PDF 更清晰）');
lines.push('');

// ---- write ----
const defaultOut = path.join(tmpdir(), 'video-loop-source', `${ep}-materials.md`);
const outPath = outIdx >= 0 ? argv[outIdx + 1] : defaultOut;
await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, lines.join('\n'), 'utf8');

console.log(`[source-materials] wrote ${outPath}`);
console.log(`  arxiv: ${arxivIds.size}, doi: ${doiIds.size}, other: ${otherLinks.size}`);
console.log(`  [提示] 若需真的下载图片，手动建 source/${ep}-figures/ 目录存放`);
