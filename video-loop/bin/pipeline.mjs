#!/usr/bin/env node
// video-loop/bin/pipeline.mjs
// 从 clean 口稿一键到 TTS mp3 + 质量校验。
//
// 用法:
//   node bin/pipeline.mjs 02a                    # 完整跑
//   node bin/pipeline.mjs 02a --force-retag      # 强制重跑 inject-tags（覆盖 tagged md）
//   node bin/pipeline.mjs 02a --skip-whisper     # TTS 校验不做 Whisper 漏字检查
//
// 依赖：
//   script/<id>-narration.md       存在（clean 口稿）
//   config.json                    存在（TTS/校验参数）
//
// 产出：
//   script/<id>-narration-tagged.md （自动注入 [short pause] 等结构 tag）
//   public/<id>-narration.mp3       （最终 TTS）

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { writeFile, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const episodeId = process.argv[2];
if (!episodeId) {
  console.error('usage: pipeline.mjs <episode-id> [--force-retag] [--skip-whisper]');
  process.exit(2);
}

const flags = { forceRetag: false, skipWhisper: false };
for (let i = 3; i < process.argv.length; i++) {
  if (process.argv[i] === '--force-retag') flags.forceRetag = true;
  else if (process.argv[i] === '--skip-whisper') flags.skipWhisper = true;
}

const cleanFile  = `script/${episodeId}-narration.md`;
const taggedFile = `script/${episodeId}-narration-tagged.md`;
const mp3Out     = `public/${episodeId}-narration.mp3`;
const tmpText    = join(tmpdir(), `video-loop-${episodeId}-tts.txt`);

if (!existsSync(cleanFile)) { console.error(`${cleanFile} 不存在`); process.exit(2); }

function run(cmd, args) {
  console.log(`\n━━━ ${cmd} ${args.join(' ')} ━━━`);
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, { stdio: 'inherit' });
    proc.on('exit', c => resolve(c ?? 1));
  });
}

// Preset: episodeId 形如 `14-v2` 走 v2，其余 v1
const preset = /-v2$/.test(episodeId) ? 'v2' : 'v1';
console.log(`[pipeline] episode=${episodeId}, preset=${preset}`);

// Step 1: verify narration
console.log('\n════════════ Step 1: verify narration ════════════');
const narrCode = await run('node', ['bin/verify-narration.mjs', cleanFile, '--preset', preset]);
if (narrCode === 1) { console.error('❌ narration errors，pipeline 终止'); process.exit(1); }
if (narrCode === 2) console.warn('⚠️  narration warnings（允许继续，但建议人工改后再跑）');

// Step 2: inject-tags (skip if tagged file newer than clean)
console.log('\n════════════ Step 2: inject structural tags ════════════');
let needInject = flags.forceRetag || !existsSync(taggedFile);
if (!needInject && existsSync(taggedFile)) {
  const cleanMt = (await stat(cleanFile)).mtimeMs;
  const taggedMt = (await stat(taggedFile)).mtimeMs;
  needInject = cleanMt > taggedMt;
}
if (needInject) {
  const code = await run('node', ['bin/inject-tags.mjs', cleanFile, taggedFile]);
  if (code !== 0) { console.error('❌ inject-tags 失败'); process.exit(1); }
} else {
  console.log(`[pipeline] tagged 文件已是最新，跳过（--force-retag 可强制）`);
}

// Step 3: strip tagged md → plain tts text
console.log('\n════════════ Step 3: strip md → TTS 文本 ════════════');
const md = await readFile(taggedFile, 'utf8');
// 先切掉 frontmatter body：split 第 3 段及以后才是正文（与 verify-narration.mjs 一致）
const fmParts = md.split(/^---\s*$/m);
const bodyMd = fmParts.length >= 3 ? fmParts.slice(2).join('---') : md;
const lines = bodyMd.split(/\r?\n/);
const out = [];
for (let i = 0; i < lines.length; i++) {
  let l = lines[i];
  if (/^#+\s/.test(l)) continue;
  if (/^---+\s*$/.test(l.trim())) continue;
  if (/^>\s/.test(l)) continue;
  l = l.replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1');
  l = l.replace(/`([^`]+)`/g, '$1');
  l = l.replace(/\[[^\]]+\]/g, '');
  // 视觉装饰符号 → 语音友好形式（Fish 对 ——/／/→/= 会念错或念出符号名）
  l = l.replace(/——+/g, '，');
  l = l.replace(/／/g, '、');
  l = l.replace(/[→←⇒⇐]/g, '，');
  l = l.replace(/\s*=\s*/g, '等于');
  l = l.replace(/[「」『』""'']/g, '');
  out.push(l);
}
const ttsText = out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
await writeFile(tmpText, ttsText, 'utf8');
console.log(`[pipeline] ${tmpText} (${ttsText.length} 字, ${(ttsText.match(/\[[^\]]+\]/g) || []).length} 个 tag)`);

// Step 4: generate TTS
console.log('\n════════════ Step 4: generate TTS ════════════');
const ttsCode = await run('node', ['bin/generate-tts.mjs', '--from-file', tmpText, '--out', mp3Out]);
if (ttsCode !== 0) { console.error('❌ TTS 生成失败'); process.exit(1); }

// Step 5: verify TTS
console.log('\n════════════ Step 5: verify TTS ════════════');
const verifyArgs = ['bin/verify-tts.mjs', mp3Out, '--source-text', tmpText];
if (flags.skipWhisper) verifyArgs.push('--skip-whisper');
const verifyCode = await run('node', verifyArgs);

// Final
console.log('\n════════════ pipeline 完成 ════════════');
console.log(`  clean:  ${cleanFile}`);
console.log(`  tagged: ${taggedFile}`);
console.log(`  mp3:    ${mp3Out}`);
if (verifyCode === 1) { console.error('  ❌ TTS 质量 fail'); process.exit(1); }
if (verifyCode === 2) console.warn('  ⚠️  TTS 质量有 warning');
else console.log('  ✅ 全部通过');
