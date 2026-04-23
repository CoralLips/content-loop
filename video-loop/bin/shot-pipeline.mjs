#!/usr/bin/env node
// video-loop/bin/shot-pipeline.mjs
// 一条命令完成 shot 的声画对齐：
//   shots/<id>.json ──→ public/<id>.mp3 ──→ public/<id>.timing.json ──→ src/.../timing/<id>.ts
//
// 用法:
//   node bin/shot-pipeline.mjs shot07
//   node bin/shot-pipeline.mjs shot07 --provider edge       # 临时换 TTS 厂商
//   node bin/shot-pipeline.mjs shot07 --skip-tts            # 已有 mp3，只跑对齐
//   node bin/shot-pipeline.mjs shot07 --model medium        # 更准的 Whisper 模型
//
// 依赖 shots/<id>.json：
//   { id, narration, phrases: [...], fps }
//
// 输出：
//   public/<id>.mp3           —— TTS 音频
//   public/<id>.wav           —— 中间 16kHz wav（debug 用）
//   public/<id>.whisper.json  —— Whisper 原始
//   public/<id>.timing.json   —— 简化 timing
//   src/compositions/SemanticRateDistortion/timing/<id>.ts  —— phrase→frame 常量

import { readFile, writeFile, unlink } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const shotId = process.argv[2];
if (!shotId) { console.error('usage: shot-pipeline.mjs <shot-id> [--provider fish|edge] [--skip-tts] [--model small|medium|large]'); process.exit(2); }

const flags = { provider: 'fish', skipTts: false, model: 'small' };
for (let i = 3; i < process.argv.length; i++) {
  if (process.argv[i] === '--provider') flags.provider = process.argv[++i];
  else if (process.argv[i] === '--skip-tts') flags.skipTts = true;
  else if (process.argv[i] === '--model') flags.model = process.argv[++i];
}

const cfgPath = `shots/${shotId}.json`;
if (!existsSync(cfgPath)) { console.error(`missing ${cfgPath}`); process.exit(2); }
const cfg = JSON.parse(await readFile(cfgPath, 'utf8'));

const mp3Path = `public/${shotId}.mp3`;
const timingJsonPath = `public/${shotId}.timing.json`;
const tsOutPath = `src/compositions/SemanticRateDistortion/timing/${shotId}.ts`;

function run(cmd, args) {
  console.log(`\n→ ${cmd} ${args.join(' ')}`);
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    proc.on('exit', c => c === 0 ? resolve() : reject(new Error(`${cmd} exit ${c}`)));
  });
}

console.log(`━━━ shot-pipeline: ${shotId} ━━━`);
console.log(`narration: ${cfg.narration.slice(0, 60)}... (${cfg.narration.length}字)`);
console.log(`phrases: ${cfg.phrases.length}`);

// 1. TTS
if (!flags.skipTts) {
  // Write narration to temp file to avoid Windows cmd argument encoding issues with CJK + em-dash
  const tmpTextFile = join(tmpdir(), `video-loop-narration-${shotId}-${Date.now()}.txt`);
  await writeFile(tmpTextFile, cfg.narration, 'utf8');
  try {
    await run('node', [
      'bin/generate-tts.mjs',
      '--provider', flags.provider,
      '--from-file', tmpTextFile,
      '--out', mp3Path,
    ]);
  } finally {
    try { await unlink(tmpTextFile); } catch {}
  }
} else {
  console.log(`\n→ [skip-tts] 使用已存在的 ${mp3Path}`);
  if (!existsSync(mp3Path)) { console.error(`${mp3Path} 不存在，不能 --skip-tts`); process.exit(1); }
}

// 2. Transcribe → timing.json
await run('node', ['bin/transcribe.mjs', mp3Path, '--model', flags.model, '--language', 'zh']);

// 3. Align → TS constants (reads shot config for narration + phrases)
await run('node', [
  'bin/align-shot.mjs',
  '--shot', shotId,
  '--fps', String(cfg.fps || 30),
  '--out', tsOutPath,
]);

console.log(`\n━━━ ${shotId} 对齐完成 ━━━`);
console.log(`  mp3:     ${mp3Path}`);
console.log(`  timing:  ${timingJsonPath}`);
console.log(`  ts:      ${tsOutPath}`);
console.log(`\n现在 shot 组件可以 import './timing/${shotId}' 里的 phraseFrames 来驱动动画`);
