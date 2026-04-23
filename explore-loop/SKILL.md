# explore-loop — 认知积累循环

> 用途：围绕已读论文做图遍历，把散点扩成思想谱系。
> 与 arxiv-loop 的分工：arxiv-loop 管发布，explore-loop 管认知。两条管线互不干扰。

## 运行一轮的步骤

### 0. 补充种子池（每轮必跑）

```bash
node D:/Projects/content-loop/explore-loop/bin/harvest-seeds.mjs
```

扫 `arxiv-loop/queue/INDEX.md`「已通过评估」区块（评分 ≥19）和 `publish-queue/unpublished/`（终端草稿），把尚未登记的 arxiv 论文追加到 seeds.md。若无新增，脚本会报「种子池无需补充」，继续下一步。

### 1. 选种子（按优先级）

读 `explore-loop/seeds.md`，筛出所有 ⬜ 行，按以下规则排序：

1. **prov 升序**（0 跳的先跑——贴 arxiv 当下）
2. 同深度 **引用降序**（引用多的先跑——挖大鱼）
3. 引用为 `-` 的排最后（该种子首跑时才会查 citation，暂按 0 计）

取第一个 ⬜，记录它的 `prov` 值（步骤 4.5 回流要用到 `prov + 1`）。

**seeds.md 里全是 ✅/❄️/⚠️ 时**：停止本轮，提示用户"种子池空，需要新一轮 arxiv-loop 扫描或手动补种"，退出。不要绕回去重跑。

### 2. 调 traverse.mjs 取引用图

```bash
node D:/Projects/content-loop/explore-loop/bin/traverse.mjs --seed <种子> --top 8 --year-min 2010
```

输出的 JSON 结构：

```json
{
  "seed": { title, year, citations, field, abstract, ... },
  "direction_used": "refs" | "cites" | "cites (auto-fallback)" | null,
  "candidates": [ { title, year, citations, abstract, oa_url, field, authors }, ... ],
  "notes": [...]
}
```

**判断**：
- `candidates` 为空 → 把种子标记为 ❄️ cold，更新 seeds.md，跳到步骤 7
- `seed.id` 为 null / 抛错 → 标记 ⚠️ 404，更新 seeds.md，跳到步骤 7
- 正常 → 继续步骤 3

### 3. 读候选、做人工筛选

读 candidates 列表，**不要照单全收**。按以下原则筛：

**留下**：
- 与 seed 有明确主题呼应（不是只靠一句 "see also" 引用过）
- 在 seed 的论证链里扮演关键前驱（它提出了 seed 用到的某个核心概念）
- 横跨领域（比如 CS seed 里出现了 Psychology 的候选）

**筛掉**：
- 纯方法论工具（"我们用 Adam optimizer"，引用 Adam 论文）
- 仅作为 benchmark/dataset 引用的（MNIST、ImageNet 那类）
- 与 seed 主题偏离太远的（引用只是礼貌性背景）

筛完保留 3-6 篇，记在脑子里继续步骤 4。

### 4. 起草谱系文件

在 `explore-loop/lineages/NNN-<slug>.md` 写入，NNN 递增（看 state.json.total_lineages + 1）。

**文件结构**：

```markdown
# <谱系主题，一句话抓住脉络>

> 种子：<seed title> (<year>, cited <N>)
> 方向：refs / cites
> 谱系长度：<N> 篇

## 脉络一句话

<把这条谱系的主线用一句话讲清楚——如果讲不清，说明候选没筛好，回步骤 3>

## 种子

**<title>** (<year>, <authors>) — <citations> 引用
<abstract 压缩成 2-3 句，讲清 seed 的核心主张>
DOI: <doi> | 原文: <oa_url>

## 前驱 / 相关

### <候选 1 title> (<year>)
<abstract 压缩 + 与 seed 的关系——它为 seed 贡献了什么概念？>
<citations> 引用 | <oa_url 或 closed>

### <候选 2 title> (<year>)
...

## 一条主线

<2-3 段叙述，把 seed 和候选串起来——这个问题最早谁提的？中间谁换了视角？seed 把它推进到哪？>

## 未解

<这条谱系里还没收尾的问题，或作者没说透的点。留给后续补种或文章用>

## 可复用到的选题

<如果谱系能支撑一篇公众号文章，记一下方向，不展开写>
```

**字数约束**：整个文件 800-1500 字。谱系不是综述——是一张思想流向图的文字版。

### 4.5. 回流候选为新种子

从步骤 3 筛出的候选（你决定写进 lineage 的那 3-6 篇）里，提取它们的 ID（arxiv ID / DOI / OpenAlex W-ID 均可），拼成逗号分隔的字符串，调用：

```bash
node D:/Projects/content-loop/explore-loop/bin/reflux.mjs \
  --parent-prov <当前种子的 prov> \
  --source lineage-NNN \
  --candidates "W1234,10.xxxx,2201.11903"
```

脚本会自己过滤：
- 引用 > 500
- 新 prov = parent + 1 <= 5
- 不在 seeds.md 里

通过的追加为 ⬜，状态记录到 seeds.md。过滤掉的打印原因。

**不需要人工判断**，直接交给 reflux.mjs。

### 5. 更新 seeds.md

把刚跑的种子从 ⬜ 改成 ✅，追加 "→ lineage NNN" 指向。

### 6. 更新 state.json

```json
{
  "last_run": "<ISO-8601>",
  "total_runs": +1,
  "total_lineages": +1,
  "processed_seeds": ["<seed>", ...]
}
```

### 7. 跳过种子的情况

若种子标记为 ❄️ 或 ⚠️，只更新 seeds.md 和 state.json.skipped_seeds/cold_seeds，不写 lineage 文件，直接结束本轮。

### 8. 报告

一行总结：
```
✅ lineage NNN 已生成（种子：<slug>，<direction_used>，<len> 篇候选），用时 Xs
```

## 不做的事

- **不跑全量 PDF**：abstract 足够
- **不自动扩展多跳**：V1 只走一跳，避免爆炸
- **不自动从 queue 拉种子**：seeds.md 是唯一入口
- **不参与发布队列**：lineages/ 是认知资产，不进 publish-queue
- **不打分**：谱系价值不量化

## 与 arxiv-loop 的边界

| 场景 | 进 arxiv-loop | 进 explore-loop |
|------|:-:|:-:|
| 刚从 arxiv 看到的新论文 | ✓ | |
| 要对某个方向深挖前驱 | | ✓ |
| 要评分筛发布 | ✓ | |
| 要追思想史 | | ✓ |
| 要积累长期认知 | | ✓ |

两个循环的文件不要交叉：arxiv-loop 产出的终端草稿永远在 `publish-queue/`；explore-loop 产出的谱系永远在 `explore-loop/lineages/`。

## 失败检查清单（完成前自查）

- [ ] 步骤 0 的 harvest-seeds.mjs 已跑
- [ ] 步骤 1 按 prov 升序 + 引用降序选的种子
- [ ] lineages/NNN-<slug>.md 已生成
- [ ] 文件字数 800-1500
- [ ] "脉络一句话"是真的一句话，不是段落
- [ ] "一条主线"段落串起了 seed + 至少 2 个候选
- [ ] 步骤 4.5 的 reflux.mjs 已跑（哪怕 0 回流也算）
- [ ] seeds.md 的种子状态已更新
- [ ] state.json 已更新
