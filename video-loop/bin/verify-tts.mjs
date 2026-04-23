#!/usr/bin/env node
// video-loop/bin/verify-tts.mjs
// 验证 TTS 产物质量，按 config.json 的 verification.tts 规则。
// 检查：时长 vs 字数比率、bitrate、（可选）Whisper 转录漏字率。
//
// 用法:
//   node bin/verify-tts.mjs <mp3> [--source-text <txt-path>] [--skip-whisper]
//
// 退出码: 0 = 全部通过；非 0 = 有 warning 或 error

import { readFile, stat } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { parseFile } from 'music-metadata';
import path from 'node:path';

const CONFIG = JSON.parse(readFileSync(new URL('../config.json', import.meta.url), 'utf8'));
const CFG = CONFIG.verification?.tts || {};

const mp3Path = process.argv[2];
if (!mp3Path) { console.error('usage: verify-tts.mjs <mp3> [--source-text <txt>] [--skip-whisper]'); process.exit(2); }

const args = { sourceText: null, skipWhisper: false };
for (let i = 3; i < process.argv.length; i++) {
  if (process.argv[i] === '--source-text') args.sourceText = process.argv[++i];
  else if (process.argv[i] === '--skip-whisper') args.skipWhisper = true;
}

function stripTagsAndHeaders(text) {
  // Remove inline Fish Audio tags like [short pause] / [emphasis]
  let t = text.replace(/\[[^\]]+\]/g, '');
  // Remove markdown headers / hrules / meta if any
  t = t.split('\n').filter(l => !l.startsWith('#') && !/^---+$/.test(l.trim()) && !l.startsWith('>')).join('\n');
  // Strip emphasis markers
  t = t.replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1');
  return t;
}

const meta = await parseFile(mp3Path);
const duration = meta.format.duration;  // seconds
const fileSize = (await stat(mp3Path)).size;  // bytes
const bitrate = meta.format.bitrate ? (meta.format.bitrate / 1000) : (fileSize * 8 / duration / 1000);  // kbps

let sourceChars = null;
if (args.sourceText && existsSync(args.sourceText)) {
  const raw = await readFile(args.sourceText, 'utf8');
  const clean = stripTagsAndHeaders(raw);
  sourceChars = [...clean].filter(c => /[^\s\p{P}]/u.test(c)).length;
}

const warnings = [];
const errors = [];

// 1. Chars per second
if (sourceChars != null) {
  const cps = sourceChars / duration;
  const min = CFG.chars_per_second_min ?? 3.5;
  const max = CFG.chars_per_second_max ?? 6.0;
  if (cps < min) warnings.push(`语速偏慢: ${cps.toFixed(2)} 字/秒 (期望 ${min}-${max})`);
  else if (cps > max) warnings.push(`语速偏快: ${cps.toFixed(2)} 字/秒 (期望 ${min}-${max})`);
  console.log(`[verify-tts] 字数 ${sourceChars} / 时长 ${duration.toFixed(1)}s = ${cps.toFixed(2)} 字/秒`);
} else {
  console.log(`[verify-tts] 未传 --source-text，跳过语速比对`);
}

// 2. Bitrate check
const minBitrate = CFG.min_bitrate_kbps ?? 80;
if (bitrate < minBitrate) errors.push(`码率偏低: ${bitrate.toFixed(0)} kbps (期望 ≥${minBitrate})`);
else console.log(`[verify-tts] 码率 ${bitrate.toFixed(0)} kbps`);

// 3. Duration sanity
if (duration < 1) errors.push(`时长过短: ${duration.toFixed(2)}s`);
if (duration > 1200) warnings.push(`时长偏长: ${duration.toFixed(0)}s`);

// 4. Optional: Whisper transcribe + drop ratio
if (!args.skipWhisper && sourceChars != null) {
  const whisperDir = path.join(process.cwd(), 'whisper.cpp');
  if (!existsSync(whisperDir)) {
    warnings.push(`未检测到 whisper.cpp 安装，跳过漏字检查（跑 bin/setup-whisper.mjs 一次性装）`);
  } else {
    console.log(`[verify-tts] 启动 Whisper 漏字检查…`);
    try {
      const transcribeOutput = await new Promise((resolve, reject) => {
        const proc = spawn('node', ['bin/transcribe.mjs', mp3Path], { stdio: ['ignore', 'pipe', 'pipe'] });
        let stdout = '', stderr = '';
        proc.stdout.on('data', d => stdout += d);
        proc.stderr.on('data', d => stderr += d);
        proc.on('exit', c => c === 0 ? resolve({ stdout, stderr }) : reject(new Error(stderr.slice(-300))));
      });
      const timingJsonPath = mp3Path.replace(/\.mp3$/i, '.timing.json');
      if (existsSync(timingJsonPath)) {
        const timing = JSON.parse(await readFile(timingJsonPath, 'utf8'));
        const transcribedChars = [...(timing.words || []).map(w => w.text).join('')].filter(c => /[^\s\p{P}]/u.test(c)).length;
        const dropRatio = 1 - (transcribedChars / sourceChars);
        const absDrop = Math.abs(dropRatio);
        // 四档阈值：≤ok 静默；ok~warn info；warn~fail warning；>fail error
        const okT = CFG.drop_ratio_ok ?? CFG.max_text_drop_ratio ?? 0.03;
        const warnT = CFG.drop_ratio_warn ?? 0.10;
        const failT = CFG.drop_ratio_fail ?? 0.20;
        console.log(`[verify-tts] 转录字数 ${transcribedChars} / 原字数 ${sourceChars} (偏差 ${(dropRatio * 100).toFixed(1)}%)`);
        if (absDrop > failT) {
          errors.push(`字数偏差 ${(dropRatio * 100).toFixed(1)}% > ${(failT * 100).toFixed(0)}% FAIL 阈值：必须修口稿或重跑 TTS`);
        } else if (absDrop > warnT) {
          warnings.push(`字数偏差 ${(dropRatio * 100).toFixed(1)}% 在 ${(warnT * 100).toFixed(0)}-${(failT * 100).toFixed(0)}% 强警告区：强烈建议修稿后重跑`);
        } else if (absDrop > okT) {
          warnings.push(`字数偏差 ${(dropRatio * 100).toFixed(1)}% 在 ${(okT * 100).toFixed(0)}-${(warnT * 100).toFixed(0)}% warn 区：可过但回听抽查`);
        }
      }
    } catch (e) {
      warnings.push(`Whisper 失败: ${e.message.slice(0, 100)}`);
    }
  }
}

// Report
console.log('\n' + '='.repeat(50));
console.log(`[verify-tts] ${mp3Path}`);
if (errors.length) {
  console.log('❌ 错误:');
  errors.forEach(e => console.log(`  - ${e}`));
}
if (warnings.length) {
  console.log('⚠️  警告:');
  warnings.forEach(w => console.log(`  - ${w}`));
}
if (!errors.length && !warnings.length) {
  console.log('✅ 全部通过');
}

process.exit(errors.length ? 1 : (warnings.length ? 2 : 0));
