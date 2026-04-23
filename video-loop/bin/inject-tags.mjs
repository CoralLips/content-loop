#!/usr/bin/env node
// video-loop/bin/inject-tags.mjs
// 从 clean 口稿自动生成 TTS 专用 tagged 版本。
// 只处理结构性 tag: [short pause] / [long pause]。
// 情绪类 tag（[emphasis]/[excited]/[sigh]）需人工在 tagged md 上补。
//
// 用法: node bin/inject-tags.mjs script/02a-narration.md script/02a-narration-tagged.md

import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

const CONFIG = JSON.parse(readFileSync(new URL('../config.json', import.meta.url), 'utf8'));

const inFile = process.argv[2];
const outFile = process.argv[3];

if (!inFile || !outFile) {
  console.error('usage: inject-tags.mjs <clean.md> <tagged.md>');
  process.exit(2);
}

const raw = await readFile(inFile, 'utf8');

// Split frontmatter (between first two --- lines) from body
let frontmatter = '';
let body = raw;
const firstHr = raw.indexOf('\n---');
if (firstHr > 0) {
  const secondHr = raw.indexOf('\n---', firstHr + 4);
  if (secondHr > firstHr) {
    frontmatter = raw.slice(0, secondHr + 4);
    body = raw.slice(secondHr + 4);
  }
}

// Skip if already tagged (avoid double-tagging)
const existingTags = (body.match(/\[(short pause|long pause|pause|emphasis|excited|soft voice|sigh|chuckle|whisper|laughing|surprised|angry|sad)\]/g) || []).length;
if (existingTags > 5) {
  console.warn(`[inject-tags] body 已有 ${existingTags} 个 tag，跳过自动注入（避免重复）`);
  await writeFile(outFile, raw);
  process.exit(0);
}

let processed = body;

// Rule 1: 问号后 → [short pause]
// 匹配中英文问号，避免已经跟着 tag 的情况
processed = processed.replace(/([?？])(?!\s*\[)/g, '$1 [short pause]');

// Rule 2: 破折号 "——" 后（仅句中，不处理行尾） → [short pause]
// 排除行尾（后面跟换行）和已有 tag 的情况
processed = processed.replace(/——(?!\s*(?:\n|\[))/g, '—— [short pause]');

// Rule 3: ## 二级标题之后的第一个内容段前 → [long pause]
// 匹配 ## 标题行后空行再下一段
processed = processed.replace(
  /^(##\s+[^\n]+)\n\n([^#\n][^\n]*)/gm,
  (match, header, firstLine) => {
    // 如果下一段已以 tag 开头，不重复插入
    if (firstLine.trim().startsWith('[')) return match;
    return `${header}\n\n[long pause] ${firstLine}`;
  },
);

// 报告统计
const tagMatches = processed.match(/\[[^\]]+\]/g) || [];
const tagCounts = tagMatches.reduce((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});

const output = frontmatter + processed;
await writeFile(outFile, output);

console.log(`[inject-tags] ${inFile} → ${outFile}`);
console.log(`[inject-tags] 注入统计:`);
for (const [tag, count] of Object.entries(tagCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${tag.padEnd(16)} ${count}`);
}
console.log(`[inject-tags] 总计 ${tagMatches.length} 个 tag`);
console.log(`[inject-tags] 提醒：情绪类 [emphasis] / [excited] 需人工在 ${outFile} 上补充`);
