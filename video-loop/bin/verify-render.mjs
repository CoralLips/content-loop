#!/usr/bin/env node
// video-loop/bin/verify-render.mjs
// 渲染前最后一道闸门。检查 TSX 与 scenes.json 是否同步 + 视觉规范。
//
// 检查：
//   G1  scenes.json 的 durationFrames 与 TSX 的 export const DURATION 一致
//   G2  v2 Act TSX 无 "Act N · XXX" 章节横幅（14-v2 事故教训，见 rules/episode-checklist.md Gate 3.5）
//   G3  提醒：使用旧 page() 模板的文件（建议迁至 shared/usePage）
//   G4  v2 Act 禁用 useFadeIn 元素累加（冷峻美学要求，见 rules/layout-v2.md）
//   G5  v2 Act 全集 Page 数 ≤ 10（从 usePage 调用数统计）
//
// 用法:
//   node bin/verify-render.mjs <scenes.json> <scenes-dir>
//   node bin/verify-render.mjs public/14-v2-scenes.json src/compositions/IntelligenceQuantitative/scenes/v2

import { readFile } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
if (argv.length < 2) {
  console.error('usage: verify-render.mjs <scenes.json> <scenes-dir>');
  process.exit(2);
}
const [scenesJsonPath, scenesDir] = argv;

const scenesJson = JSON.parse(await readFile(scenesJsonPath, 'utf8'));
const sceneFiles = readdirSync(scenesDir).filter(f => /^(Scene|Act)\d+.*\.tsx$/.test(f));

const fails = [];
const warns = [];

// ---- G1: DURATION sync ----
const durationMap = new Map(); // id → durationFrames
for (const s of scenesJson.scenes) durationMap.set(s.id, s.durationFrames);

for (const f of sceneFiles) {
  const content = await readFile(path.join(scenesDir, f), 'utf8');
  const durMatch = content.match(/export\s+const\s+DURATION\s*=\s*(\d+)/);
  if (!durMatch) {
    warns.push(`[G1] ${f}: 未找到 export const DURATION（可能手动写 frame 数，跳过）`);
    continue;
  }
  const tsxDur = parseInt(durMatch[1], 10);

  // 文件名 CamelCase → json id snake_case:
  //   Act1_Puzzle.tsx        → act1_puzzle
  //   Scene6_ChineseRoom.tsx → scene6_chinese_room
  const id = f
    .replace(/\.tsx$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/__+/g, '_');
  const jsonDur = durationMap.get(id);

  if (jsonDur === undefined) {
    warns.push(`[G1] ${f}: 在 scenes.json 未找到对应 id "${id}"（命名不一致？）`);
    continue;
  }
  if (jsonDur !== tsxDur) {
    fails.push(`[G1] ${f}: DURATION 不一致 — TSX=${tsxDur}, scenes.json=${jsonDur} (差 ${tsxDur - jsonDur} frames)`);
  }
}

// ---- G2: 章节横幅扫描（仅对 v2 Act） ----
for (const f of sceneFiles) {
  if (!/^Act\d+/.test(f)) continue;
  const content = await readFile(path.join(scenesDir, f), 'utf8');
  const bannerRe = /Act\s*[1-5]\s*·/g;
  const matches = [...content.matchAll(bannerRe)];
  if (matches.length > 0) {
    fails.push(`[G2] ${f}: 发现 ${matches.length} 处 "Act N ·" 章节横幅（v2 冷峻美学禁止，见 rules/episode-checklist.md Gate 3.5）`);
  }
}

// ---- G3: 建议使用 usePage hook ----
for (const f of sceneFiles) {
  const content = await readFile(path.join(scenesDir, f), 'utf8');
  if (/const\s+page\s*=\s*\(frame:/m.test(content) && !content.includes('usePage')) {
    warns.push(`[G3] ${f}: 仍在使用旧 page() 模板（可迁至 shared/usePage，省 6 行/文件）`);
  }
}

// ---- G4: v2 Act 禁用 useFadeIn 累加（冷峻美学）----
const isV2 = scenesDir.includes('v2') || scenesDir.endsWith('/v2');
if (isV2) {
  for (const f of sceneFiles) {
    if (!/^Act\d+/.test(f)) continue;
    const content = await readFile(path.join(scenesDir, f), 'utf8');
    const fadeInCount = (content.match(/\buseFadeIn\b/g) || []).length;
    if (fadeInCount > 0) {
      warns.push(`[G4] ${f}: 使用了 useFadeIn (${fadeInCount} 处) — v2 冷峻美学禁用元素累加，只用 usePage 整体淡入。见 rules/layout-v2.md`);
    }
  }

  // ---- G5: v2 全集 Page 数 ≤ 10 ----
  let totalPages = 0;
  const actBreakdown = [];
  for (const f of sceneFiles) {
    if (!/^Act\d+/.test(f)) continue;
    const content = await readFile(path.join(scenesDir, f), 'utf8');
    const pageCalls = (content.match(/\busePage\s*\(/g) || []).length;
    totalPages += pageCalls;
    actBreakdown.push(`${f.replace(/\.tsx$/, '')}=${pageCalls}`);
  }
  if (totalPages > 10) {
    fails.push(`[G5] v2 全集 Page 数 = ${totalPages}，超过上限 10 (${actBreakdown.join(', ')})。见 rules/layout-v2.md`);
  } else if (totalPages > 0) {
    console.log(`[G5] v2 Page 数 = ${totalPages}/10 (${actBreakdown.join(', ')})`);
  }
}

// ---- 报告 ----
console.log(`\n=== verify-render ===`);
console.log(`scenes.json:  ${scenesJsonPath}`);
console.log(`scenes dir:   ${scenesDir}`);
console.log(`scene files:  ${sceneFiles.length}`);
console.log('');

if (fails.length === 0 && warns.length === 0) {
  console.log(`✅ 全部通过`);
  process.exit(0);
}

if (fails.length > 0) {
  console.log(`❌ ${fails.length} 个硬性失败（必须修）:`);
  for (const f of fails) console.log('  ' + f);
  console.log('');
}
if (warns.length > 0) {
  console.log(`⚠️  ${warns.length} 个提醒（可选改）:`);
  for (const w of warns) console.log('  ' + w);
  console.log('');
}

process.exit(fails.length > 0 ? 1 : 0);
