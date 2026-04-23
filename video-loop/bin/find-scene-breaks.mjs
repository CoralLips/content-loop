#!/usr/bin/env node
// video-loop/bin/find-scene-breaks.mjs
// 根据 whisper timing.json 找场景切换时间点。
// 直接在 whisper 重建文本里 indexOf 锚点，避免 narration 对齐的 FFFD 跳位问题。
//
// 用法:
//   node bin/find-scene-breaks.mjs <timing.json> <out.json> --anchors <anchors.json>
//   node bin/find-scene-breaks.mjs <timing.json> <out.json>                          # 自动推导：scene-anchors/{episode}-{preset}.json
//
// 锚点文件约定（scene-anchors/{episode}-{preset}.json）：
//   { "episode": "...", "preset": "v1|v2",
//     "scenes": [ { "id": "scene1_hook", "start_anchor": null }, ... ] }

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const timingPath = args[0];
const outPath = args[1];

if (!timingPath || !outPath) {
  console.error('usage: find-scene-breaks.mjs <timing.json> <out.json> [--anchors <anchors.json>]');
  process.exit(2);
}

const anchorsIdx = args.indexOf('--anchors');
let anchorsPath = anchorsIdx >= 0 ? args[anchorsIdx + 1] : null;

// 自动推导：从 timing.json 文件名反推 episode-preset.json
if (!anchorsPath) {
  const base = path.basename(timingPath).replace(/\.timing\.json$/i, '').replace(/-narration$/i, '');
  // base 形如 "14", "14-v2", "02a", "02a-v2"
  const preset = /-v2$/.test(base) ? 'v2' : 'v1';
  const ep = base.replace(/-v2$/, '');
  const guess = path.join('scene-anchors', `${ep}-${preset}.json`);
  if (existsSync(guess)) {
    anchorsPath = guess;
    console.log(`[find-scene-breaks] 自动选用锚点文件: ${anchorsPath}`);
  } else {
    console.error(`[find-scene-breaks] 未指定 --anchors，且未找到自动锚点文件 ${guess}`);
    process.exit(2);
  }
}

const anchorsCfg = JSON.parse(await readFile(anchorsPath, 'utf8'));
const SCENE_ANCHORS = anchorsCfg.scenes;
if (!Array.isArray(SCENE_ANCHORS) || SCENE_ANCHORS.length === 0) {
  console.error(`[find-scene-breaks] ${anchorsPath} 的 scenes 字段缺失或为空`);
  process.exit(2);
}
console.log(`[find-scene-breaks] episode=${anchorsCfg.episode} preset=${anchorsCfg.preset}，共 ${SCENE_ANCHORS.length} 个场景`);

const timing = JSON.parse(await readFile(timingPath, 'utf8'));
const segments = timing.segments || [];

// 重建 whisper 文本 + 每个字对应的 segment start time
let text = '';
const charToTime = [];
for (const seg of segments) {
  const segText = (seg.text || '').trim();
  if (!segText) continue;
  const segChars = [...segText].filter(c => !/\s/.test(c));
  for (const c of segChars) {
    text += c;
    charToTime.push(seg.start);
  }
}

console.log(`[find-scene-breaks] whisper 重建文本长度: ${text.length} 字`);

function findAnchorTime(anchor, searchStartChar = 0) {
  if (anchor == null) return { time: 0, textPos: 0 };
  const clean = [...anchor].filter(c => !/\s/.test(c)).join('');
  let idx = text.indexOf(clean, searchStartChar);
  if (idx === -1) {
    // 模糊：取前 3 字
    const short = clean.slice(0, 3);
    idx = text.indexOf(short, searchStartChar);
    if (idx === -1) return null;
    console.warn(`[find-scene-breaks] 用短锚点 "${short}" 代替 "${clean}" (位置 ${idx})`);
  }
  return { time: charToTime[idx], textPos: idx };
}

let lastTextPos = 0;
const breaks = [];
for (const { id, start_anchor } of SCENE_ANCHORS) {
  if (start_anchor == null) {
    breaks.push({ id, startSec: 0, _textPos: 0 });
    continue;
  }
  const result = findAnchorTime(start_anchor, lastTextPos);
  if (result == null) {
    console.error(`[find-scene-breaks] 未找到锚点 "${start_anchor}"`);
    process.exit(1);
  }
  breaks.push({ id, startSec: parseFloat(result.time.toFixed(3)), _textPos: result.textPos });
  lastTextPos = result.textPos + start_anchor.length;
}

// Compute end times
const totalDuration = segments[segments.length - 1]?.end ?? 0;
for (let i = 0; i < breaks.length; i++) {
  const next = breaks[i + 1];
  breaks[i].endSec = next ? next.startSec : parseFloat(totalDuration.toFixed(3));
  breaks[i].durationSec = parseFloat((breaks[i].endSec - breaks[i].startSec).toFixed(3));
  breaks[i].startFrame = Math.round(breaks[i].startSec * 30);
  breaks[i].endFrame = Math.round(breaks[i].endSec * 30);
  breaks[i].durationFrames = breaks[i].endFrame - breaks[i].startFrame;
  delete breaks[i]._textPos;
}

await writeFile(outPath, JSON.stringify({ totalDuration, fps: 30, scenes: breaks }, null, 2), 'utf8');

console.log(`[find-scene-breaks] 音频总长: ${totalDuration.toFixed(2)}s`);
console.log(`[find-scene-breaks] 场景切换点:`);
for (const b of breaks) {
  const mm = Math.floor(b.startSec / 60), ss = (b.startSec % 60).toFixed(1);
  console.log(`  ${b.id.padEnd(20)} ${String(mm).padStart(2, '0')}:${ss.padStart(4, '0')}  (时长 ${b.durationSec}s, ${b.durationFrames} frames)`);
}
console.log(`[find-scene-breaks] wrote ${outPath}`);
