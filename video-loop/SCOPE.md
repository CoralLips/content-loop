# video-loop SCOPE

> 不是完整 SKILL 文件。是一张共识表，钉死这条管线的边界。手搓跑通第一集后再决定要不要 pipeline 化。

## 目标

把 `publish-queue/` 的公众号成稿转成 1080p mp4 视频，最多 5-10 分钟人工（仅 preview review 和平台上传）。

## 视觉档位

- **低档**：大字滚屏 + 纯色背景 + 简图（适合 90s 快稿）
- **中档**：动态图文 + 示意图渐现 + 数据图表（适合 2-3 min 精稿）
- **禁止**：定制插画、人物动画、任何需要外部图像 API 的素材

## 素材边界（两类）

**Type 1：代码生成**
- SVG 手写
- Lucide React 图标库
- Recharts / visx 数据图
- ASCII-to-SVG 流程图
- 公式渲染（KaTeX）

**Type 2：现成素材**
- 原论文 figure（PDF 截图 / arxiv html 提取）
- 公版肖像（Wikipedia commons）
- 搜索找到的开放许可图

**超出这两类的 → 不做**，调整 shot 绕过去。

## 技术栈

- Remotion 4 + React 18 + TypeScript
- TTS：**Fish Audio（主）** + Edge TTS（免费兜底）
- ASR + 词级对齐：本地 whisper.cpp (small 模型) + opencc 繁→简
- 音画对齐：shot 级（mp3 时长 → Sequence frames）+ 词级（narration 短语 → interpolate anchor）
- 输出：1080p @ 30fps H.264 mp4

## 设计架构：章节大纲统领

> 对比废弃方案：~~画面优先~~（shot = 画面单元）、~~口稿优先~~（shot = 口稿段落）。
> 正式采用：**章节叙事单元**——shot 定义「让观众搞懂 X」，口稿和画面并列服务这个大纲。

```
原稿 (02a.md)
  ↓
整体剧本 02a-script.md          [审级 1] 叙事弧 / 节奏 / 章节列表 + 一句话大纲
  ↓
章节详纲 02a-chapters.md         [审级 2] 每章节：目的/时长/情绪/信息密度
  ↓ 并行展开
  ├─ 口稿 02a-narration.md      [审级 3a] 逐段自然口语，追求通顺易懂
  └─ 画面 02a-visuals.md        [审级 3b] 每章节视觉元素，追求生动简洁
  ↓
结构化：shots/chapter-NN.json（合并 narration + phrases + 视觉 meta）
  ↓
管线：bin/shot-pipeline.mjs（TTS → Whisper → align → render）
  ↓
out/02a.mp4
```

**每一层可独立审核。上层定义目标，下层拟合。**

## 手搓第一集的流程（替换前一版）

1. 写 `02a-script.md` → 审级 1（用户审叙事弧 + 章节划分）
2. 写 `02a-chapters.md` → 审级 2（用户审每章节目的）
3. 并行写 `02a-narration.md` + `02a-visuals.md` → 审级 3a/3b
4. 结构化成 `shots/*.json`
5. 跑 `bin/shot-pipeline.mjs <chapter-id>` 一键生成 mp3 + timing + align
6. 每章节写 `ChapterNN_*.tsx` 组件，使用 phrase→frame 常量驱动动画
7. Studio preview → 调 → 再渲染
8. 复盘：记录哪步卡、哪步顺，为下一集 pipeline 化留线索

## 第一集

- **稿件**：`publish-queue/published/02a-semantic-rate-distortion.md`
- **档位**：中
- **目标时长**：~120s（章节数由叙事需要决定，不硬指定 14 个）
- **输出**：`out/02a.mp4`

## 不做的事

- 不先写 pipeline 脚本（手搓经验未攒够）
- 不追求一次完美——第一版能发就行
- 不扩到其他稿件——等这一集定稿
- **不直接从稿件跳到画面**——必须经过整体剧本 + 章节详纲两层审核
