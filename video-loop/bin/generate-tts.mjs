#!/usr/bin/env node
// video-loop/bin/generate-tts.mjs
// 生成中文 TTS mp3。支持两个 provider：
//   - fish  (Fish Audio API, 默认)       — 需 .env 里的 FISH_AUDIO_API_KEY + FISH_AUDIO_VOICE_ID
//   - edge  (Microsoft Edge TTS, 免费)  — 依赖 Python 的 edge-tts 包
//
// 用法:
//   node bin/generate-tts.mjs --text "中文" --out public/shot07.mp3
//   node bin/generate-tts.mjs --provider edge --text "中文" --out public/shot07.mp3
//   node bin/generate-tts.mjs --from-file shots/shot07.txt --out public/shot07.mp3

import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { dirname } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { ProxyAgent, setGlobalDispatcher } from 'undici';

// 读 config.json 作为参数默认值（可被 CLI 覆盖，或被 .env 覆盖）
function loadConfig() {
  const p = new URL('../config.json', import.meta.url);
  try { return JSON.parse(readFileSync(p, 'utf8')); }
  catch { return { tts: {} }; }
}
const CONFIG = loadConfig();

// 加载 .env（简化版，不上第三方包）— 必须在 Proxy 检测前跑
async function loadEnv() {
  try {
    const buf = await readFile(new URL('../.env', import.meta.url), 'utf8');
    for (const line of buf.split('\n')) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  } catch {}
}
await loadEnv();

// 读代理（Node fetch 默认不认系统代理）。.env 里的 HTTPS_PROXY 此时已被 loadEnv 注入。
const PROXY = process.env.HTTPS_PROXY || process.env.HTTP_PROXY
  || process.env.https_proxy || process.env.http_proxy;
if (PROXY) {
  setGlobalDispatcher(new ProxyAgent(PROXY));
  console.log(`[tts] using proxy: ${PROXY}`);
}

const args = {
  text: null,
  fromFile: null,
  out: null,
  provider: CONFIG.tts?.provider || 'fish',
  voice: null,          // fish: reference_id | edge: voice name
  rate: null,
  pitch: null,
  speed: CONFIG.tts?.speed ?? 1.0,  // fish only
};
for (let i = 2; i < process.argv.length; i++) {
  const k = process.argv[i];
  if (k === '--text') args.text = process.argv[++i];
  else if (k === '--from-file') args.fromFile = process.argv[++i];
  else if (k === '--out') args.out = process.argv[++i];
  else if (k === '--provider') args.provider = process.argv[++i];
  else if (k === '--voice') args.voice = process.argv[++i];
  else if (k === '--rate') args.rate = process.argv[++i];
  else if (k === '--pitch') args.pitch = process.argv[++i];
  else if (k === '--speed') args.speed = parseFloat(process.argv[++i]);
}

if (!args.out) { console.error('--out required'); process.exit(2); }
const text = args.fromFile ? await readFile(args.fromFile, 'utf8') : args.text;
if (!text) { console.error('--text or --from-file required'); process.exit(2); }

await mkdir(dirname(args.out), { recursive: true });

console.log(`[tts] provider=${args.provider}`);
console.log(`[tts] text=${text.replace(/\n/g, ' ').slice(0, 80)}${text.length > 80 ? '…' : ''} (${text.length}字)`);

async function genFish() {
  const key = process.env.FISH_AUDIO_API_KEY;
  const voice = args.voice || process.env.FISH_AUDIO_VOICE_ID || CONFIG.tts?.voice_id;
  const model = process.env.FISH_AUDIO_MODEL || CONFIG.tts?.model || 's2-pro';
  if (!key) throw new Error('FISH_AUDIO_API_KEY not set (.env)');
  if (!voice) throw new Error('FISH_AUDIO_VOICE_ID not set (.env / --voice / config.json)');

  // 最小参数集合。以前加 chunk_length / normalize 会让 Fish 过早截断中文长句。
  const body = {
    text,
    reference_id: voice,
    format: 'mp3',
  };
  if (args.speed && args.speed !== 1.0) body.speed = args.speed;

  console.log(`[fish] voice=${voice}, model=${model}`);
  const res = await fetch('https://api.fish.audio/v1/tts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'model': model,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Fish Audio HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(args.out, buf);
}

async function genEdge() {
  const voice = args.voice || 'zh-CN-XiaoxiaoNeural';
  const cmdArgs = ['-m', 'edge_tts', '--text', text, '--voice', voice, '--write-media', args.out];
  if (args.rate) cmdArgs.push('--rate', args.rate);
  if (args.pitch) cmdArgs.push('--pitch', args.pitch);
  console.log(`[edge] voice=${voice}`);
  await new Promise((resolve, reject) => {
    const proc = spawn('python', cmdArgs, { stdio: ['ignore', 'inherit', 'inherit'] });
    proc.on('exit', c => c === 0 ? resolve() : reject(new Error(`edge_tts exit ${c}`)));
    proc.on('error', reject);
  });
}

try {
  if (args.provider === 'fish') await genFish();
  else if (args.provider === 'edge') await genEdge();
  else throw new Error(`unknown provider: ${args.provider}`);

  const s = await stat(args.out);
  console.log(`[tts] wrote ${args.out} (${(s.size / 1024).toFixed(1)} KB)`);
} catch (e) {
  console.error(`[tts] FAILED: ${e.message}`);
  process.exit(1);
}
