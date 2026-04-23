#!/usr/bin/env node
// video-loop/bin/new-episode.mjs
// 创建新集工作骨架 — narration + layout + anchors 三份模板一次生成。
//
// 用法:
//   node bin/new-episode.mjs <ep-id>
//   node bin/new-episode.mjs <ep-id> --from publish-queue/published/15-xxx.md
//
// 产出（v2 preset 默认，只创建不存在的文件）：
//   script/{ep}-v2-narration.md    口稿（人写）
//   script/{ep}-v2-layout.md       画面编排（人写，过审后才做 TSX）
//   scene-anchors/{ep}-v2.json     场景锚点骨架（TTS 后填 start_anchor）

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ep = process.argv[2];
const fromIdx = process.argv.indexOf('--from');
const sourceMd = fromIdx >= 0 ? process.argv[fromIdx + 1] : '';

if (!ep || ep.startsWith('-')) {
  console.error('usage: new-episode.mjs <ep-id> [--from <published.md>]');
  console.error('example: new-episode.mjs 15 --from publish-queue/published/15-semantic-entropy.md');
  process.exit(2);
}

const files = [
  {
    path: `script/${ep}-v2-narration.md`,
    content: `---
episode: "${ep}"
title: ""
source: ${sourceMd || '<publish-queue/published/XX.md>'}
preset: v2
target_duration_min: 3.5
target_chars: 900
annotations: []
定位：单谜题深潜。
风格：冷峻句感 + 保留叙事连接词，单句 ≤25 字。
5 Act：谜面 / 常识错在哪 / 新工具 / 谜底 / 余韵
---

# Act 1 谜面

（3-4 句，≤ 25 字/句。抛核心问题 + 现状，钩子结尾）

# Act 2 常识错在哪

（常识或过去的尝试为何失败，引入历史人物/思想实验）

# Act 3 新工具

（本月/新方法的核心思路，引入 2-4 个关键术语）

# Act 4 谜底

（新方法如何解决谜面，给出核心数值 / 结论）

# Act 5 余韵

（对"你"的启示 / 扩展 / 可操作含义）
`,
  },
  {
    path: `script/${ep}-v2-layout.md`,
    content: `---
episode: "${ep}"
preset: v2
duration: TBD
pages_total: TBD (上限 10)
source_tsx: src/compositions/<Composition>/scenes/v2/Act*.tsx
paired_narration: script/${ep}-v2-narration.md
---

# ${ep}-v2 画面编排

> 规则：见 rules/layout-v2.md
> - 每页整体淡入淡出（usePage），禁用 useFadeIn 累加
> - 每页 ≤ 3 元素，6-20s
> - 画面不复刻旁白已说过的字
> - 全集 ≤ 10 页

---

## Act 1 · 谜面 （≤ 2 页）

### Page 1
- **旁白**：
- **画面**：
  1.
- **素材**：无

### Page 2
- **旁白**：
- **画面**：
  1.
- **素材**：无

## Act 2 · 常识错在哪 （≤ 2 页）

### Page 1
- **旁白**：
- **画面**：
- **素材**：

### Page 2
...

## Act 3 · 新工具 （≤ 2 页）

### Page 1
...

## Act 4 · 谜底 （≤ 3 页）

### Page 1
...

## Act 5 · 余韵 （≤ 2 页）

### Page 1
...

---

## 全集素材总结

**外部素材使用**（若有）：
-

**候选可加但当前未用**：
-
`,
  },
  {
    path: `scene-anchors/${ep}-v2.json`,
    content: JSON.stringify({
      episode: ep,
      preset: 'v2',
      desc: `${ep} — 5 Act 谜题切片`,
      scenes: [
        { id: 'act1_puzzle', start_anchor: null, note: '谜面' },
        { id: 'act2_common', start_anchor: '', note: '常识错在哪 — 填 TTS 后首句前 3-5 字' },
        { id: 'act3_tool',   start_anchor: '', note: '新工具' },
        { id: 'act4_reveal', start_anchor: '', note: '谜底' },
        { id: 'act5_coda',   start_anchor: '', note: '余韵' },
      ],
    }, null, 2) + '\n',
  },
];

let created = 0;
let skipped = 0;
for (const f of files) {
  if (existsSync(f.path)) {
    console.log(`[skip] ${f.path} (已存在)`);
    skipped++;
    continue;
  }
  await mkdir(path.dirname(f.path), { recursive: true });
  await writeFile(f.path, f.content, 'utf8');
  console.log(`[create] ${f.path}`);
  created++;
}

console.log(`\n[new-episode] ${created} 创建 · ${skipped} 跳过`);
console.log(`\n下一步（按顺序）：`);
console.log(`  1. 编辑 script/${ep}-v2-narration.md（写口稿）`);
console.log(`  2. 编辑 script/${ep}-v2-layout.md（写画面编排，审过才做 TSX）`);
console.log(`  3. node bin/verify-narration.mjs script/${ep}-v2-narration.md --preset v2`);
console.log(`  4. node bin/pipeline.mjs ${ep}-v2`);
console.log(`  5. 填 scene-anchors/${ep}-v2.json 的 start_anchor`);
console.log(`  6. node bin/find-scene-breaks.mjs public/${ep}-v2-narration.timing.json public/${ep}-v2-scenes.json`);
console.log(`  7. copy 14-v2 的 Act TSX 到新 composition，按 layout.md 改（遵守 rules/layout-v2.md）`);
console.log(`  8. node bin/verify-render.mjs public/${ep}-v2-scenes.json src/compositions/<Composition>/scenes/v2`);
console.log(`  9. npx remotion render <CompositionV2> out/${ep}-v2-final.mp4`);
