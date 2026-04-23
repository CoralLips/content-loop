# video-loop — 从公众号稿到视频的完整流程

> 本文档把"一篇成稿 → 一集视频"的流程固化成可复用步骤。
> 依据来自第一集 02a 的实战——所有坎都踩过了，规则是从失败里提炼出来的。
> 对齐 arxiv-loop / eval-loop / explore-loop 的 SKILL 风格：每步都是可执行的命令。

---

## 哲学（先读三条硬规则）

1. **口稿为核心，画面为辅**。单独听口稿就能懂的视频，才是合格的讲解视频（参考 3Blue1Brown / 李永乐）。动效和图形不能抢旁白的戏。

2. **极简视觉**。纯文字为主，每 scene 2-3 页，fade 时长 12 帧（0.4s）。**不做**：SVG 隐喻、柱状图、曲线箭头、黑板拟物、人物肖像——AI coding agent 画这些硬伤明显，容易过度设计。要视觉"炫"交给 Claude Design / Figma，不是 Claude Code。

3. **不用 Fish Audio inline tags**。`[short pause]` / `[emphasis]` 等 tag 会让 S2-Pro 合成出可闻的填充噪音（第一集实测）。中文标点（`。`、`，`、`——`）本身就有自然停顿，够用了。**config.json 里 tag 规则保留着但不进 pipeline**，等将来换 TTS 再启用。

---

## 前置条件

- `.env` 填好 `FISH_AUDIO_API_KEY` 和 `FISH_AUDIO_VOICE_ID`（modelId 32-hex，不是公开的短数字 ID）
- 系统有 HTTP 代理环境变量（国内访问 Fish Audio 需要走代理）
- `bin/setup-whisper.mjs` 已跑过一次，`whisper.cpp/ggml-small.bin` 在位
- `config.json` 里 TTS 参数：`speed: 0.9`（慢 10% 更稳）

---

## 流程总览（v2 层，2026-04-21 更新为 layout-first）

```
公众号稿 .md                      [人工写]
  ↓ bin/new-episode.mjs            [脚手架：生成 narration / layout / anchors 骨架]
  ↓
script/XX-v2-narration.md          [gate 1a：口稿人读审核]
  ↓ bin/verify-narration.mjs --preset v2
  ↓
script/XX-v2-layout.md ★           [gate 1b：画面编排人读审核]
  ↓                                [遵循 rules/layout-v2.md：≤10 页，每页 ≤3 元素，静镜不累加]
  ↓ （过 gate 1b 才动 TSX）
  ↓ bin/pipeline.mjs XX-v2         [TTS → verify → Whisper 时间戳]
  ↓
public/XX-v2-narration.mp3         [gate 2：人听审核]
  ↓ 填 scene-anchors/XX-v2.json
  ↓ bin/find-scene-breaks.mjs
public/XX-v2-scenes.json
  ↓ 按 layout.md 写 5 个 Act TSX    [gate 3：单 Act 审，用 Studio]
  ↓ bin/verify-render.mjs          [G1 DURATION / G2 横幅 / G4 累加 / G5 页数]
src/compositions/<Comp>/scenes/v2/Act*.tsx
  ↓ npx remotion render
out/XX-v2-final.mp4                [gate 4：人看完整成片]
```

5 个审核 gate（加了 layout-first 的 1b）。**画面编排过审才动 TSX**，避免做完 mp4 才发现节奏错。

---

## 步骤

### 0. 写 clean 口稿

**输入**：公众号成稿 `.md`
**输出**：`script/XX-narration.md`（口语化重写版）

写作硬标准（4 条）：
1. 关键概念先铺垫——不突然冒出"不可约核"，先说"最小集合"再说术语
2. 抽象 + 具体交替——每讲一个抽象概念，立刻给具体例子
3. 节奏有喘息——每 30-40 秒有"停下来想想"的时刻（反问、短句、重复）
4. 指代清晰——不用"它"、"这个"、"那个"（听众没法回看上一句）

**约束**：
- 比原稿长 1.3-1.5 倍（讲话比读慢）
- 信息量与原稿对齐（不砍核心，可适当展开）
- 用 `##` 标注章节结构（方便 gate 3 切场景）

**注意**：这份 md **直接喂 TTS**，所以不要加 `[short pause]` 之类的 tag。用正常中文标点即可。

### 1. 验证口稿（硬规则自查）

```bash
cd video-loop
node bin/verify-narration.mjs script/XX-narration.md
```

检查：
- 未铺垫的术语（config.json `unwhitelisted_terms` 列表）
- 平均句长 > 40 字警告
- 单句 > 80 字警告
- 代词密度过高警告

输出警告的话，改 md 再跑。通过 → **gate 1 过**。

### 2. 生成 TTS

一条命令跑完 strip + tts + 校验：

```bash
node bin/pipeline.mjs XX
```

**或者分步手动**：

```bash
# 2a. strip md → 纯文本（去掉 markdown 结构、去掉任何 [tag]）
node -e "
const fs = require('fs');
const md = fs.readFileSync('script/XX-narration.md', 'utf8');
const lines = md.split(/\r?\n/); const out = [];
let i = 0; while (i < lines.length && !lines[i].startsWith('---')) i++; i++;
for (; i < lines.length; i++) {
  let l = lines[i];
  if (/^#+\s/.test(l)) continue;
  if (/^---+\s*\$/.test(l.trim())) continue;
  if (/^>\s/.test(l)) continue;
  l = l.replace(/\*{1,2}([^*]+)\*{1,2}/g, '\$1');
  l = l.replace(/\[[^\]]+\]/g, '');
  out.push(l);
}
fs.writeFileSync('C:/Users/CL/AppData/Local/Temp/XX-tts.txt', out.join('\n').trim());
"

# 2b. TTS
node bin/generate-tts.mjs --provider fish \
  --from-file "C:/Users/CL/AppData/Local/Temp/XX-tts.txt" \
  --out public/XX-narration.mp3

# 2c. 校验质量
node bin/verify-tts.mjs public/XX-narration.mp3 \
  --source-text "C:/Users/CL/AppData/Local/Temp/XX-tts.txt" --skip-whisper
```

### 3. 听 TTS（gate 2）

双击 `public/XX-narration.mp3` 从头听到尾。

**通过标准**：
- 没有突兀的杂音（如果有→检查是否加 tag 了，tag 是元凶）
- 语速不至于太快（`verify-tts` 应报 3.5-6.0 字/秒）
- 念错字可接受 1-2 处（修改 narration md 对应位置重跑）

**不通过**：
- 大量念错 → 改 md 里的用词（避免 Fish 难念的字），重跑 step 2
- 杂音 → 检查文本是否有 tag，全部去掉，重跑
- 语速太快/慢 → 调 config.json `tts.speed`

### 4. Whisper 转录拿时间戳

```bash
node bin/transcribe.mjs public/XX-narration.mp3 --model small --language zh
```

产出 `public/XX-narration.timing.json`（每个字的时间戳）。

### 5. 定位场景切换点

**先编辑** `bin/find-scene-breaks.mjs` 的 `SCENE_ANCHORS` 数组——列出每个场景的起始锚点（narration 原文里独一的短句 3-6 字）。

选锚点的原则：
- 独一无二（全稿只出现一次）
- 避开可能被 whisper 错转的字（生僻字、外来词）
- 能在 whisper text search 里 indexOf 成功

然后：
```bash
node bin/find-scene-breaks.mjs public/XX-narration.timing.json public/XX-scenes.json
```

输出场景表：
```
scene1_xxx  00:00.0  时长 58s, 1742 frames
scene2_xxx  00:58.0  时长 50s, 1489 frames
...
```

### 6. 写 Scene TSX 组件

**每个 scene 一个 TSX 文件**，位于 `src/compositions/<Comp>/scenes/SceneN_Name.tsx`。

**必须**：
- 导出 `DURATION` 常量（frames 数，从 step 5 的 scenes.json 抄）
- 导出 `SceneN_Name` React 组件
- 用共享的 `page()` fade 函数（见模板）

**每个 scene 只有 2-3 页**（Scene 5/6/8 可以 3 页，其他 2 页）。每页：
- 标签小字 + 主文字（大号）
- 可能带 1 个 accent 色彩高亮词
- 绝对定位居中，用 `opacity` 切换

**模板**：

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = XXXX;  // frames @ 30fps，从 scenes.json 抄

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const SceneN_Name: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, Math.round(DURATION / 2));
  const p2 = page(frame, Math.round(DURATION / 2), DURATION);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div style={{ position: 'absolute', opacity: p1, /* 排版 */ }}>
        Page A 内容
      </div>
      <div style={{ position: 'absolute', opacity: p2, /* 排版 */ }}>
        Page B 内容
      </div>
    </AbsoluteFill>
  );
};
```

### 7. 注册 Scene 到 Root.tsx（让 Studio 可预览单场景）

Root.tsx 里增加 8 个 Composition。**id 不能有下划线**，用连字符（Remotion 限制）：

```tsx
<Composition id="Scene1-Name" component={makeScenePreview(Scene1_Name, SCENE_OFFSETS_SEC[0])} ... />
```

`makeScenePreview` 包装器会把音频从对应秒数 `startFrom` 播放，让单 scene 预览带正确段音频。

### 8. Studio 实时预览（gate 3）

```bash
npx remotion studio
```

浏览器开 `http://localhost:3001`（端口递增占用）。左边栏点单 scene 看效果。

**调整节奏**：
- 某页停留太久 → 调整 `page(frame, enter, exit)` 的数字
- 想加一页 → 加 `const p3 = page(frame, X, Y);` 和对应 div
- 想换字号/颜色 → 改 inline style，Studio 热重载

**单 scene 渲染**：Studio 右上角 "Render" 按钮，15-30 秒出一个场景 mp4。

### 9. 全片渲染（gate 4）

```bash
npx remotion render SemanticRateDistortion out/XX-final.mp4 --log=info
```

13000 帧（7 分钟视频）大约 3-5 分钟渲染时间（看 CPU）。

双击 `out/XX-final.mp4` 整片审。通过 → 可发。

---

## 配置参数（config.json）

```json
{
  "tts": {
    "provider": "fish",
    "voice_id": "<32-hex modelId>",
    "model": "s2-pro",
    "speed": 0.9,
    "format": "mp3"
  },
  "verification": {
    "narration": {
      "unwhitelisted_terms": ["不可约核", "推理闭包", ...],
      "max_avg_sentence_chars": 40,
      "max_single_sentence_chars": 80
    },
    "tts": {
      "chars_per_second_min": 3.5,
      "chars_per_second_max": 6.0,
      "min_bitrate_kbps": 80
    }
  }
}
```

改参数前先跑一遍，看是否影响整体，别乱调。

---

## 常见坎（按频率排）

| 坎 | 症状 | 修 |
|---|------|---|
| 音频有杂音 | 句末/句中突兀声音 | 检查是否有 tag，全去掉 |
| TTS 截断 | mp3 比预期短 | 检查 body 里有无 `chunk_length`/`normalize`——删掉 |
| Composition id 报错 | Remotion render 失败 | id 不能含下划线，用连字符 |
| Windows cmd CJK 截断 | batch 跑 TTS 某几段被腰斩 | 走 `--from-file`，不走 `--text` |
| Node fetch 连不上 Fish | `fetch failed UND_ERR_CONNECT_TIMEOUT` | 检查 ProxyAgent 是否加载 |
| Fish voice 404 | `Reference not found` | 在 fish.audio 先点"使用"激活 voice，并用 URL 里的 modelId 不是短 id |
| Whisper 中文字有 `��` | CJK token 边界断裂 | 用 opencc + 直接 text search，不信任 1:1 字符映射 |
| HuggingFace 模型下不了 | 直连超时 | 换 hf-mirror.com |
| 对齐偏差 | 场景切换不准 | 锚点换一个独一的短语重跑 find-scene-breaks |

---

## 关键文件

```
video-loop/
├── SKILL.md                    本文件
├── SCOPE.md                    边界（视觉档/素材类型）
├── PIPELINE.md                 技术栈文档
├── config.json                 固化参数
├── .env                        API keys（不进 git）
├── script/
│   └── XX-narration.md         ← 编辑人工写，gate 1 审
├── public/
│   ├── XX-narration.mp3        TTS 输出
│   ├── XX-narration.timing.json  Whisper 输出
│   └── XX-scenes.json          场景切换时间戳
├── bin/
│   ├── generate-tts.mjs        ← step 2b
│   ├── audio-duration.mjs
│   ├── transcribe.mjs          ← step 4
│   ├── find-scene-breaks.mjs   ← step 5
│   ├── verify-narration.mjs    ← step 1
│   ├── verify-tts.mjs          ← step 2c
│   ├── inject-tags.mjs         ⚠️ 暂不用（Fish Audio tag 产杂音）
│   └── pipeline.mjs            orchestrator for step 2
└── src/
    ├── theme.ts                色/字 token
    ├── index.ts
    ├── Root.tsx                ← step 7
    └── compositions/<Comp>/
        ├── Main.tsx            组装 Sequences
        └── scenes/SceneN_*.tsx ← step 6
```

---

## 明确不做的事

- ❌ **加 Fish Audio inline tags**（步骤 2 明确跳过 inject-tags）
- ❌ **复杂视觉动效**（SVG 隐喻、柱状图、曲线、渐变）—— 这些 Claude Code 做不好
- ❌ **字幕**（用户自己用剪映/视频号 AI 字幕加，Remotion 不做）
- ❌ **多 voice 切换**（一集一个主持人 voice 到底，Fish reference_id 固定）
- ❌ **字符级 word-alignment**（gate 3 后就不调 scene timing，人听接受小偏差）

---

## 下一集怎么跑（TL;DR）

```bash
# 1. 写 script/XX-narration.md（人工）
# 2. 一键跑 口稿校验 + TTS
node bin/pipeline.mjs XX

# 3. 听 public/XX-narration.mp3 → 满意再继续

# 4. 转录 + 场景切分
node bin/transcribe.mjs public/XX-narration.mp3 --model small --language zh
# 编辑 bin/find-scene-breaks.mjs 的 SCENE_ANCHORS
node bin/find-scene-breaks.mjs public/XX-narration.timing.json public/XX-scenes.json

# 5. 写 SceneN_*.tsx（copy 第一集的当模板，改内容和 DURATION）

# 6. 预览
npx remotion studio

# 7. 渲染
npx remotion render SemanticRateDistortion out/XX-final.mp4
```

一集稳定工时估：**口稿 1-2 小时 + Scene TSX 1-2 小时 + 渲染等 5 分钟 = 3-4 小时/集**。
