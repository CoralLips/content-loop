#!/usr/bin/env node
// video-loop/bin/transcribe.mjs
// 把 mp3 转成 16kHz wav，跑 whisper.cpp，输出 token 级时间戳 JSON。
//
// 用法:
//   node bin/transcribe.mjs public/shot07.mp3
//   node bin/transcribe.mjs public/shot07.mp3 --model medium --language zh
//
// 输出:
//   public/shot07.wav         —— 中间 wav 文件（保留用于 debug）
//   public/shot07.whisper.json —— Whisper 原始输出
//   public/shot07.timing.json  —— 压缩成易读的 { segments, words } 结构

import path from 'node:path';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { transcribe } from '@remotion/install-whisper-cpp';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as OpenCC from 'opencc-js';

// 繁 → 简 转换器（Whisper 中文输出默认繁体，我们的稿件是简体）
const tw2cn = OpenCC.Converter({ from: 'tw', to: 'cn' });

const input = process.argv[2];
if (!input) { console.error('usage: transcribe.mjs <file.mp3> [--model small|medium|large] [--language zh]'); process.exit(2); }

let model = 'small';
let language = 'zh';
for (let i = 3; i < process.argv.length; i++) {
  if (process.argv[i] === '--model') model = process.argv[++i];
  else if (process.argv[i] === '--language') language = process.argv[++i];
}

const absInput = path.resolve(input);
const basePath = absInput.replace(/\.(mp3|m4a|wav|aac|ogg)$/i, '');
const wavPath = basePath + '.wav';
const whisperJsonPath = basePath + '.whisper.json';
const timingJsonPath = basePath + '.timing.json';
const whisperDir = path.join(process.cwd(), 'whisper.cpp');

// 1. mp3 → 16kHz mono wav
console.log(`[transcribe] step 1/3: converting ${input} → ${wavPath} (16kHz mono wav)`);
await new Promise((resolve, reject) => {
  const proc = spawn(ffmpegInstaller.path, [
    '-y', '-i', input, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wavPath,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  let err = '';
  proc.stderr.on('data', d => err += d.toString());
  proc.on('exit', c => c === 0 ? resolve() : reject(new Error(`ffmpeg exit ${c}: ${err.slice(-300)}`)));
});

// 2. run whisper.cpp
console.log(`[transcribe] step 2/3: running whisper.cpp (model=${model}, language=${language}, tokenLevelTimestamps=true)`);
const result = await transcribe({
  inputPath: wavPath,
  whisperPath: whisperDir,
  whisperCppVersion: '1.5.5',
  model,
  tokenLevelTimestamps: true,
  language,
});

// 3. save
await writeFile(whisperJsonPath, JSON.stringify(result, null, 2), 'utf8');

// Build easy-to-consume timing structure
const segments = [];
const words = [];
for (const seg of result.transcription || []) {
  const segText = tw2cn(seg.text || '');
  segments.push({
    text: segText,
    start: seg.offsets?.from != null ? seg.offsets.from / 1000 : null, // ms → s
    end: seg.offsets?.to != null ? seg.offsets.to / 1000 : null,
  });
  for (const tok of seg.tokens || []) {
    // Skip special tokens (start with [_, are control tokens)
    const text = tw2cn((tok.text || '').trim());
    if (!text || text.startsWith('[_')) continue;
    const start = tok.t_dtw != null ? tok.t_dtw / 100 : (tok.offsets?.from != null ? tok.offsets.from / 1000 : null);
    const end = tok.offsets?.to != null ? tok.offsets.to / 1000 : null;
    if (start == null) continue;
    words.push({ text, start, end });
  }
}

await writeFile(timingJsonPath, JSON.stringify({ model, language, segments, words }, null, 2), 'utf8');

const s = await stat(whisperJsonPath);
console.log(`[transcribe] step 3/3: ${segments.length} segments, ${words.length} tokens`);
console.log(`[transcribe] wrote ${whisperJsonPath} (${(s.size / 1024).toFixed(1)} KB)`);
console.log(`[transcribe] wrote ${timingJsonPath} (simplified)`);
