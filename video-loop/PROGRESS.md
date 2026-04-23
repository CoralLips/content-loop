# video-loop 进度

## 当前状态：Phase 2 自动化工具就位（2026-04-21）

**本日落地**（修 14-v2 章节横幅 bug 后的一轮工程化）：

- `src/compositions/shared/usePage.ts` — Remotion page hook，消掉 10 处 `page()` 样板
- v2 Act 全量迁至 `usePage` — IQ + SRD 共 10 个 Act TSX
- `bin/extract-narration.mjs` — 从 published/{ep}.md 产出剧本拆解草稿 `shots/{ep}-draft.json/.md`
- `bin/source-materials.mjs` — 扒 arxiv/doi，生成 `source/{ep}-materials.md` 半自动素材索引
- `bin/verify-render.mjs` — 渲染前闸门：G1 DURATION 同步 / G2 章节横幅 / G3 HOC 提示
- `rules/narration-v2.md` — 新增幕头语法硬性约束（H2 + `·`，H1 禁用）
- `rules/episode-checklist.md` — Gate 3.5 脚本化（引用 verify-render.mjs）

**14-v2 章节横幅 bug 修复**：5 个 IQ Act TSX 已清理 "Act N · XXX" 横幅 div。待重渲染验证。

---

## 上一阶段：第一集 v1+v2 完成 + Phase 1 规则固化（2026-04-20）

**v1 成片**：`out/02a-final.mp4` (21 MB, 7:09) — 已通过人工审
**v2 成片**：`SemanticRateDistortionV2` composition（3:26，5 Act，谜题切片式） — 已过审

## Phase 1 工程化（今日落地）

目标：把 v1/v2 两条管道的"经验"固化成可检查规则，为下一集稳定性铺垫。

- **rules/narration-v1.md**：导览式 7min 规范（80-120 字/段，三拍结构，连接词密度 1/2 句）
- **rules/narration-v2.md**：谜题切片 3min 规范（单句 ≤25 字，连接词 1/3 句，术语必须铺垫或 Annotation 标注）
- **rules/episode-checklist.md**：Gate 0-5 闸门（论文 → v1 口稿 → TTS → Scene → 渲染 → v2 可选）
- **config.json**：`verification.narration.presets.{v1,v2}`，分离阈值；`tts.drop_ratio_{ok,warn,fail}` 四档
- **bin/verify-narration.mjs**：`--preset v1|v2` 参数；加 R0 视觉符号扫描、R5 连接词密度、R6 段长
- **bin/verify-tts.mjs**：漏字率 ≤3% OK / 3-10% warn / 10-20% 强警告 / >20% FAIL

**验证**：对 02a 两稿跑新 verify，准确抓出 v1 视觉符号/连接词密度不足，v2 单句超 30 字/术语无铺垫。规则有效。

---

## 本集走完的完整路径

1. **口稿**：`script/02a-narration.md`（2500 字口语版，基于 `publish-queue/published/02a-semantic-rate-distortion.md` 重写）
2. **TTS**：Fish Audio S2-Pro, voice `3ba198f728c64871bc93340f02a5b2d2`（男鸡蛋主持人），speed 0.9
3. **关键决定**：**不加 inline tags** — 经实测 `[short pause]`/`[emphasis]` 会让 Fish S2 合成杂音（每句间突兀声）
4. **Whisper**：small 模型 + opencc 繁→简，2525 segments
5. **场景**：8 scene，由 `bin/find-scene-breaks.mjs` 按锚点对齐时间戳
6. **画面**：极简纯文字，每 scene 2-3 页，fade 12 帧（0.4s），无 SVG/柱状图/隐喻
7. **渲染**：1920×1080 @ 30fps，13084 frames → 约 3-5 分钟渲染

## 本集工时回顾

约 6 小时（含所有试错）。熟练之后下集预计 3-4 小时。

## 工程化产出

- **SKILL.md**：10 步完整流程，4 个审核 gate，9 条踩过的坎
- **SCOPE.md**：边界 + 架构 C（章节大纲统领）
- **config.json**：voice/speed/verification 参数固化
- **bin/**：7 个脚本（pipeline / generate-tts / transcribe / find-scene-breaks / verify-narration / verify-tts / inject-tags）
- **src/compositions/SemanticRateDistortion/scenes/**：8 个 Scene TSX 模板，可复制作下一集起点

## 下一步

**主线 A：跑第二集（Phase 1 规则真实验证）**
- 严格按 `rules/episode-checklist.md` 从 Gate 0 开始
- 看规则能不能让 AI 第一稿就过 verify（不用多轮返工）
- 下集结束后补 Phase 2 候选项：锚点配置外置、scene DURATION 从 scenes.json auto-import

**主线 B：Phase 2（2-3 集样本攒够后）**
- Scene 模板化（把每个 Act 的 page() 三拍抽成 HOC）
- pipeline.mjs 自动触发 verify，不过不发 TTS

## 阻塞项

无。

## 外部依赖状态

- Fish Audio 余额：$100 - 第一集消耗约 $0.09 = 约 $99.91（按 Fish $15/1M UTF-8 bytes 定价，2500 字中文 ≈ 0.06 mil UTF-8）
- Whisper `ggml-small.bin`：已下载（487 MB）
- 代理：本地 127.0.0.1:7890，Node ProxyAgent 已配
