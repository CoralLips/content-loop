#!/usr/bin/env node
// video-loop/bin/audio-duration.mjs
// 读取 mp3/wav/m4a 等音频文件的时长（秒），用于 Remotion 对齐 durationInFrames。
//
// 用法:
//   node bin/audio-duration.mjs public/shot07.mp3            → 15.23
//   node bin/audio-duration.mjs public/shot07.mp3 --frames 30 → 457 (frames @ 30fps)

import { parseFile } from 'music-metadata';

const file = process.argv[2];
if (!file) { console.error('usage: audio-duration.mjs <file> [--frames <fps>]'); process.exit(2); }

const fpsIdx = process.argv.indexOf('--frames');
const fps = fpsIdx > -1 ? parseInt(process.argv[fpsIdx + 1], 10) : null;

const meta = await parseFile(file);
const sec = meta.format.duration;

if (fps) {
  const frames = Math.ceil(sec * fps);
  console.log(frames);
} else {
  console.log(sec.toFixed(3));
}
