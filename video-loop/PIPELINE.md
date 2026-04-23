# video-loop 管线说明

> 单集视频的完整打通路径。手搓阶段写下，给 pipeline 化留线索。

## 管线图

```
shots/shot07.json                       ← 人工/LLM 产出：narration + 要对齐的短语
  ↓ bin/generate-tts.mjs
public/shot07.mp3                       ← TTS 配音
  ↓ bin/transcribe.mjs
public/shot07.whisper.json              ← Whisper 原始
public/shot07.timing.json               ← 简化 timing（segments + words）
  ↓ bin/align-shot.mjs
src/compositions/SemanticRateDistortion/timing/shot07.ts   ← phrase→frame 常量
  ↓ Shot 组件 import 进 interpolate()
src/compositions/SemanticRateDistortion/shots/Shot07_*.tsx
  ↓ npx remotion render
out/semantic-rate-distortion.mp4        ← 最终视频
```

一条命令跑完：

```bash
node bin/shot-pipeline.mjs shot07
```

## 脚本清单

### 已打通

| 脚本 | 作用 | 依赖 |
|------|------|------|
| `bin/generate-tts.mjs` | 文本 → mp3（Fish Audio 或 Edge TTS） | Fish: API key；Edge: python edge-tts |
| `bin/audio-duration.mjs` | 读 mp3/wav 时长 | music-metadata |
| `bin/transcribe.mjs` | mp3 → whisper.json + timing.json | @remotion/install-whisper-cpp, @ffmpeg-installer/ffmpeg |
| `bin/align-shot.mjs` | timing.json → phrase→frame TS 常量 | 无（纯解析） |
| `bin/shot-pipeline.mjs` | 以上三步一条龙 | 上面全部 |
| `bin/setup-whisper.mjs` | 一次性下载 whisper.cpp + ggml 模型 | @remotion/install-whisper-cpp |

### 待做

- `bin/extract-narration.mjs` — 从 .md 稿件里自动拆 shot 和 narration（剧本拆解自动化）
- `bin/source-materials.mjs` — 从 .md 的 arxiv 链接扒论文原图 / 截图（素材搜集 Type 2）
- `bin/batch-shots.mjs` — 一次跑所有 shots，产出整集视频

## 两个 TTS provider

| provider | 开启方式 | 质量 | 成本 | 需要什么 |
|----------|----------|------|------|---------|
| **fish** | `--provider fish`（默认） | 顶级中文 | 按字数计费 | `.env` 里 `FISH_AUDIO_API_KEY` + `FISH_AUDIO_VOICE_ID` |
| **edge** | `--provider edge` | 良好 | 免费 | `pip install edge-tts` |

## 对齐两层

### Level 1 — shot 级对齐（简单）

`transcribe.mjs` + `align-shot.mjs` 都不参与——只需：
```js
// Main.tsx
<Sequence durationInFrames={N}>  // N 由 bin/audio-duration.mjs --frames 30 输出
```

### Level 2 — 词级对齐（刚通）

```ts
// 自动生成 src/.../timing/shot07.ts
export const phraseFrames = {
  "所有人都会死": 60,
  "苏格拉底是人": 119,
  "苏格拉底会死": 182,
} as const;

// Shot07_Syllogism.tsx
import { phraseFrames } from './timing/shot07';

const fact1Entry = interpolate(
  frame,
  [phraseFrames["所有人都会死"] - 5, phraseFrames["所有人都会死"] + 15],
  [0, 1],
  { extrapolateRight: 'clamp' }
);
```

## Whisper 模型选择

| 模型 | 大小 | 中文质量 | 速度（1 分钟音频） |
|------|------|----------|--------------------|
| tiny | 39MB | 差 | 5-10s |
| base | 74MB | 中 | 10-15s |
| **small** | **500MB** | **够用** | **15-30s** |
| medium | 1.5GB | 优 | 45-90s |
| large-v3 | 3GB | 顶 | 2-4min |

默认 small。中文专业术语多的稿件可换 medium。

## .env 配置

```
FISH_AUDIO_API_KEY=<fish.audio 生成的 key>
FISH_AUDIO_VOICE_ID=<你挑的 voice 的 reference_id>
FISH_AUDIO_MODEL=s2-pro
```

已加进 `.gitignore`，不进 git。

## 下一步：剧本拆解自动化

`bin/extract-narration.mjs`（待建）：
- 输入：`publish-queue/published/02a-semantic-rate-distortion.md`
- 输出：`shots/shot01.json` ~ `shots/shot14.json`
- LLM 逻辑：
  1. 读 .md 的章节
  2. 把每章拆成 1-3 个 shot（每 shot 对应一段 narration）
  3. 识别每段里的关键短语作为对齐点
  4. 识别视觉类型（title/list/compare/formula/citation/closing）
  5. 匹配到 TSX 模板组件

这一步完成后，整条管线的"人工最小化"就成立了。
