# arXiv Loop

## 每轮执行

1. **拉取**：curl arXiv API，获取最新论文（标题+摘要），不限定篇数，拉当天所有新的
   ```
   curl "https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.CL+OR+cat:cs.IT+OR+cat:cs.LG&sortBy=submittedDate&sortOrder=descending&max_results=50"
   ```

2. **去重**：对照 state.json，跳过已读过的论文（按 arXiv ID）

3. **快扫**：读标题，明显不相关的直接跳过

4. **细筛**：读摘要，按 config.md 的使命、方向、品味判断
   - 这是重大发现还是有趣思路？
   - 都不是 → 跳过
   - 没有命中的 → 记录"本轮无新发现"，结束

5. **深读**：对命中的论文，拉取全文 PDF 关键部分
   - WebFetch 获取 arXiv HTML 版本，或从 PDF 提取
   - 需要拿到：Introduction 核心段落、关键实验结果、Conclusion

5.5. **采集学术权威信号（2026-04-22 加入）**：防止把 arxiv 边缘论文当成权威发现
   - **Semantic Scholar API**：`https://api.semanticscholar.org/graph/v1/paper/arxiv:{id}?fields=authors,venue,citationCount,influentialCitationCount,authors.hIndex`
   - **采集四项信号**：
     - `venue`：是否已被顶会/顶刊接收（NeurIPS/ICML/ICLR/ACL/CVPR/AAAI/Nature/Science 等）
     - `authors.hIndex`：首作和末作的 h-index
     - `authors.affiliations`：机构（Top 20/50/100 或大厂研究院）
     - `influentialCitationCount`：如已有引用，取 influential citation 数（比普通引用更严格）
   - **写入 queue 文件**的 `## 权威信号` 字段（见下方模板）
   - **失败容忍**：API 超时/404 时写 `权威信号: 未获取`，由 eval-loop 给可信度 0-1 分

6. **素材整理**：写入 queue/ 文件，格式见下方模板

7. **更新 INDEX.md**：每写一篇 queue 文件，同步在 `queue/INDEX.md` 的"待审核"表**底部追加新行**（评分列填 `—` 代表"待评"，会排到表格末尾）。行格式：`| — | {批次} | {#} | {标题} | {品味} |`；批次列用 `MM-DD` 或 `MM-DD NNN-NNN`。

   扫描循环**只**追加未评行到"待审核"段，不动评分、不动排序、不动其他段。评分 + 排序 + 移动行的职责属于 eval-loop。

8. **更新状态**：所有扫过的论文 ID 写入 state.json

## queue 文件格式

queue 是**素材验证文档**，不是最终发布内容。目标：用户打开一个文件，不离开这个文件就能完成审核决策。

```markdown
# [一句话定位]

> ⬜ 待审核 | 品味命中：重大发现/有趣思路 | 方向：A/B

## 简单说
[用大白话，3-5 句，不用任何术语。让完全不懂这个领域的人也能明白：
发现了什么、为什么重要、跟普通人有什么关系。不必强套固定格式，
怎么说清楚怎么来。]

---

## 论文信息
- 标题 / 链接 / 日期 / 团队

## 权威信号（2026-04-22 加入）
- **Venue**：[例：已被 NeurIPS 2026 接收 / arxiv 预印本未评审]
- **首作**：[姓名] · [机构] · h-index=[N]
- **末作**：[姓名] · [机构] · h-index=[N]
- **机构权威度**：[例：MIT CSAIL Top 20 / 大厂研究院 / 未知小机构]
- **Influential Citations**：[N]（Semantic Scholar 提供；新论文通常为 0）
- **初步可信度判断**：[0-3 分，交 eval-loop 最终裁定]

## 原文摘要（完整）
[论文原始 abstract，不删改]

## 论文核心内容
### 动机与背景（从 Introduction 提取）
[论文自己说的：为什么做这个、解决什么问题]

### 关键发现 / 方法
[核心结果、关键数据点、方法的独特之处]

### 结论（从 Conclusion 提取）
[论文自己的总结]

## AI 分析
### 为什么值得关注
- 差异化：和现有认知有什么不同
- 独特性：为什么别人没做/没想到
- 贡献度：如果成立，影响多大
- 局限：可能有什么问题

## 审核
- [ ] ✅ 素材可用
- [ ] ❌ 不用（原因：        ）
- [ ] 📌 加入长期追踪
```

## 终止条件

- 当天新内容全部扫完为止
- 不以篇数或产出数量为目标
- 没有好素材就不产出，记录"无新发现"

## 文件组织规则

- queue/ 下按日期建子文件夹：`queue/YYYY-MM-DD/`
- 每 20 篇一组，超过 20 篇自动建 batch 子文件夹：`queue/YYYY-MM-DD/batch-001-020/`、`batch-021-040/`...
- 文件名：`NNN.md`（三位数序号，当天从 001 开始，跨 batch 连续编号）
- state.json 记录当天已生成的序号，下轮接着编

## Loop 触发

SKILL.md 包含完整流程定义。Loop prompt 只需：
```
/loop 2m 执行 D:/Projects/content-loop/arxiv-loop/SKILL.md 中定义的一轮扫描循环
```
