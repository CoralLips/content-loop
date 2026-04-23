# Episode 启动 Checklist

每期新 episode（如 `02b`、`03a`）按以下顺序过闸。任何一关没过，不要前进到下一关。

---

## Gate 0 · 论文与选题

- [ ] 论文 PDF / arxiv 链接落到 `source/{ep}.pdf`
- [ ] 读完一遍，能用 3 句话讲清「问题 / 方法 / 结论」
- [ ] 判断是否值得做 v2 谜题切片：**有一个能说「这不可能」的反常识点** → 值得 v2；没有 → 只做 v1
- [ ] 更新 `SCOPE.md` 加入本期定位

## Gate 1 · v1 主口稿

- [ ] 写 `script/{ep}-narration.md` 遵循 `rules/narration-v1.md`
- [ ] 跑 `node bin/verify-narration.mjs script/{ep}-narration.md --preset v1`
- [ ] 0 warning 或全部 warning 有意识豁免（在 frontmatter 注明）
- [ ] 朗读一遍，听感 check：每段都能一口气读完，不绕

## Gate 2 · v1 TTS + 对齐

- [ ] 跑 pipeline 生成 `public/{ep}-narration.mp3` + `{ep}.timing.json`
- [ ] 跑 `node bin/verify-tts.mjs public/{ep}-narration.mp3 --source-text script/{ep}-narration.md`
- [ ] 漏字率：**≤ 3% OK / 3-10% warn（可过但回看）/ 10-20% 必须修口稿 / > 20% FAIL**
- [ ] 听前 30 秒，确认没有爆音、断词

## Gate 3 · v1 Scene 切分

- [ ] `node bin/find-scene-breaks.mjs public/{ep}.timing.json public/{ep}-scenes.json --preset v1`
- [ ] 人工审 scenes.json：每个 scene 起止在句首，不在句中
- [ ] 同步 DURATION 到 8 个 Scene*.tsx 的 `DURATION = xxx`
- [ ] 同步 offset 到 `Root.tsx.SCENE_OFFSETS_SEC`

## Gate 3.5 · 渲染前闸门（verify-render.mjs）

渲染前必须通过，防止 DURATION 漂移 + 章节横幅误渲染（14-v2 事故教训）：

```bash
# v1
node bin/verify-render.mjs public/{ep}-scenes.json src/compositions/{Composition}/scenes
# v2
node bin/verify-render.mjs public/{ep}-v2-scenes.json src/compositions/{Composition}/scenes/v2
```

检查项：
- **G1** scenes.json 的 `durationFrames` 与 TSX 的 `export const DURATION` 一致（防 TTS 重跑后 Act tsx 没同步）
- **G2** v2 Act TSX 无 "Act N · XXX" 章节横幅（冷峻美学要求：首页直接上内容，不挂 PPT 式章节页）
- **G3** 提醒：v1 旧 Scene 可迁至 `shared/usePage` hook（非阻塞）

- [ ] verify-render 返回 exit 0（G1/G2 全过，G3 提醒可选处理）

## Gate 4 · v1 渲染

- [ ] `npx remotion render SemanticRateDistortion out/{ep}.mp4`
- [ ] 无 TS 错误，无 composition resolve 错误
- [ ] 过一遍关键转场：scene 切换时音频不错位

## Gate 5 · v2 谜题切片（可选，手动触发）

只在 Gate 0 判断「值得 v2」时跑。**流程更新（2026-04-21）**：v2 引入 layout-first —— 画面编排 md 先过审，才动 TSX。

### 5a · 脚手架

- [ ] `node bin/new-episode.mjs {ep} --from publish-queue/published/{ep}-xxx.md`
- [ ] 生成 3 份骨架：narration / layout / scene-anchors

### 5b · 口稿（narration）

- [ ] 编辑 `script/{ep}-v2-narration.md` 遵循 `rules/narration-v2.md`
- [ ] `node bin/verify-narration.mjs script/{ep}-v2-narration.md --preset v2`
- [ ] 0 warning 或全部 warning 有意识豁免

### 5c · 画面编排（layout-first）★ 新增

- [ ] 编辑 `script/{ep}-v2-layout.md` 遵循 `rules/layout-v2.md`
- [ ] **自检**：
  - 全集 Page 数 ≤ 10
  - 每页元素 ≤ 3
  - 每页时长 6-20s
  - 画面文字不重复旁白已说的字
  - 无 "Act N · XXX" 章节横幅（Gate 3.5）
- [ ] **人审**：读一遍 layout.md，能想象出画面是静态翻书感，不是 PPT 动画

### 5d · TTS + 对齐

- [ ] `node bin/pipeline.mjs {ep}-v2`
- [ ] 填 `scene-anchors/{ep}-v2.json` 的 `start_anchor`（TTS 后从口稿里挑独一短语）
- [ ] `node bin/find-scene-breaks.mjs public/{ep}-v2-narration.timing.json public/{ep}-v2-scenes.json`

### 5e · 实现 TSX

- [ ] 按 `layout.md` 做 5 个 Act TSX（copy 14-v2 作模板，删 useFadeIn 相关代码，只保留 usePage）
- [ ] 同步各 Act DURATION 到 scenes.json
- [ ] Root.tsx 注册新 composition

### 5f · 渲染前 Gate（verify-render）

- [ ] `node bin/verify-render.mjs public/{ep}-v2-scenes.json src/compositions/{Comp}/scenes/v2`
- [ ] G1 DURATION 同步通过
- [ ] G2 无章节横幅
- [ ] G4 无 useFadeIn 使用（下一集起强约束）
- [ ] G5 Page 数 ≤ 10

### 5g · 渲染 + 回看

- [ ] `npx remotion render {Comp}V2 out/{ep}-v2-final.mp4`
- [ ] 听完 + 看完 + 对比 v1：v2 是否提供了 v1 给不了的紧张感？没有就砍掉

## 写回

每过一关，在 `PROGRESS.md` 勾掉。当期结束更新：

- 口稿字数、TTS 时长、漏字率
- 新发现的规则（如果这一期发现 rules/ 漏了什么，立刻补进去再进下一期）
