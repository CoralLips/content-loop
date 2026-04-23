#!/usr/bin/env node
// video-loop/bin/setup-whisper.mjs
// 一次性：安装 whisper.cpp 二进制 + 下载 ggml 模型。
// 大约需 5-15 分钟（看网速）；模型下载完之后后续 transcribe 不用再装。
//
// 用法:
//   node bin/setup-whisper.mjs                 # 默认 small 模型 (~500MB)
//   node bin/setup-whisper.mjs --model medium  # 更准但慢 (~1.5GB)

import path from 'node:path';
import { installWhisperCpp, downloadWhisperModel } from '@remotion/install-whisper-cpp';

const args = { model: 'small' };
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--model') args.model = process.argv[++i];
}

const whisperDir = path.join(process.cwd(), 'whisper.cpp');

console.log('[whisper] step 1/2: installing whisper.cpp binary...');
const install = await installWhisperCpp({
  to: whisperDir,
  version: '1.5.5',
  printOutput: true,
});
console.log(`[whisper] whisper.cpp ${install.alreadyExisted ? '已存在' : '安装完成'}`);

console.log(`[whisper] step 2/2: downloading model '${args.model}'...`);
const download = await downloadWhisperModel({
  model: args.model,
  folder: whisperDir,
  printOutput: true,
});
console.log(`[whisper] model '${args.model}' ${download.alreadyExisted ? '已存在' : '下载完成'}`);
console.log(`[whisper] ready at: ${whisperDir}`);
