# explore-loop 配置

> 与 arxiv-loop 的区别：arxiv-loop 是「扫新 → 评分 → 发布」的线性管线；explore-loop 是「种子 → 图遍历 → 谱系」的认知积累管线。产出物是谱系笔记，不进发布队列。

## 目的

围绕已读论文向外探索——通过 OpenAlex 引用图追溯一条思想的前驱/后继/同期相关工作，把散点扩成谱系，用于：
- 补齐"只读新论文"漏掉的思想史
- 找到多篇新论文共同指向的底层母题
- 产出可独立使用的谱系文档（不走发布队列）

## 产出物差异（vs arxiv-loop）

| 维度 | arxiv-loop | explore-loop |
|------|------------|--------------|
| 输入 | arxiv 最新 50 篇 | 已读论文（种子） |
| 单位 | 单篇论文 | 思想谱系 |
| 时间指向 | 向前（最新） | 向后（前驱）+ 向侧（同期） |
| 输出 | 终端草稿（待发布） | 谱系笔记（认知资产） |
| 节奏 | 时间敏感 | 时间无关 |

## 参数

```yaml
# traverse.mjs
year_min: 2010             # 默认最低年份
classic_threshold: 3000    # 引用超此阈值可豁免 year_min
top_n: 8                   # 每次遍历取 Top-N 候选
direction_default: refs    # 前向（references）优先；为空自动降级到 cites

# harvest-seeds.mjs —— A. 入口门槛
harvest_score_threshold: 19    # arxiv-loop INDEX.md 里评分 >= 19 的才入种子池
harvest_sources:
  - arxiv-loop/queue/INDEX.md  # 已通过评估区块
  - publish-queue/unpublished/ # 终端草稿（兜底）

# reflux.mjs —— B. 回流门槛 + C. 漂移控制
reflux_citation_threshold: 500 # 候选引用数 > 500 才回流
reflux_max_depth: 5            # provenance 跳数超过此值不再回流

# SKILL 步骤 1 优先级 —— D. 种子优先级
priority_order: provenance_asc_then_citations_desc
# prov 浅的先跑（贴 arxiv 当下）；同深度按引用数降序（先挖大的）
```

## API 层

**OpenAlex 为主**：一次请求拿到元数据 + referenced_works + cited_by_api_url + abstract_inverted_index + open_access.oa_url。

**Unpaywall 不启用**：实测对 arxiv DOI 返 404，对老期刊 DOI 返 `is_oa=false`，0% 补漏率。若未来种子开始涵盖封闭 journal 文章，再启用作为兜底。

**PDF 全文不抓**：abstract 足够支撑谱系笔记；谁想深挖原文，顺着 oa_url 手动点。

## 方向偏好

沿用 arxiv-loop/config.md 的方向（A = AI/Agent/认知洞察；B = 广义信息论 × 人类理解），但 explore-loop **不打分**——谱系价值不可数值化，只判断「这条链是否值得串起来」。

## 失败行为

- 种子 404（OpenAlex 未收录）→ 记录到 state.json.skipped，移交下一个种子
- refs 为空 → 自动降级到 cited_by
- refs 和 cites 都空 → 标记种子为 `cold`，不重试

## 补种机制

种子来源：
1. `explore-loop/seeds.md` 手动登记（V1 启动用）
2. 从 `arxiv-loop/queue/**/*.md` 里已评分 ≥15 的论文自动提取 arxiv ID（V2）
3. 从 `publish-queue/unpublished/*.md` 脚注提取（V2）
