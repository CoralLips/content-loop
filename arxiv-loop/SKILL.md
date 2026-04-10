# arXiv Loop

## 每轮执行

1. **拉取**：curl arXiv API，获取最近的新论文（标题+摘要）
   ```
   curl "http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&sortOrder=descending&max_results=20"
   ```

2. **去重**：对照 state.json，跳过已读过的论文（按 arXiv ID）

3. **筛选**：读所有标题和摘要，判断哪些"有意思"
   - 判断标准参考 config.md 中的方针
   - 选出 1-3 个最值得说的

4. **评估**：对选中的论文，写一段评估
   - 为什么有意思？
   - 核心贡献是什么？
   - 有什么值得吐槽或值得兴奋的？

5. **生成**：写成一条可发布的短内容（参考 config.md 中的风格要求）
   - 生成 2-3 个变体
   - 自评选出最佳

6. **存储**：最佳内容存到 queue/，格式：
   ```
   queue/YYYY-MM-DD-NNN.md
   ---
   source: arXiv
   arxiv_id: xxxx.xxxxx
   title: 原论文标题
   generated_at: ISO timestamp
   score: 自评分(1-10)
   ---
   [可发布内容]
   ```

7. **更新状态**：把本轮读过的论文 ID 写入 state.json
