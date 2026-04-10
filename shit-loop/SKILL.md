# SHIT Journal Loop

## 每轮执行

1. **爬取**：用 agent-browser 打开 https://shitjournal.org/archive
   - 等待页面渲染（SPA，需要 JS 执行）
   - 提取文章列表（标题、摘要、链接）

2. **去重**：对照 state.json，跳过已读过的内容

3. **筛选**：判断哪些"有意思"
   - 判断标准参考 config.md 中的方针
   - 选出 1-3 个最值得说的

4. **深读**：对选中的内容，点进详情页读全文

5. **评估**：写一段评估
   - 它在讽刺什么真实的学术问题？
   - 为什么好笑/有共鸣？
   - 背后有没有真正的洞察？

6. **生成**：写成一条可发布的短内容（参考 config.md 中的风格要求）
   - 生成 2-3 个变体
   - 自评选出最佳

7. **存储**：最佳内容存到 queue/，格式：
   ```
   queue/YYYY-MM-DD-NNN.md
   ---
   source: SHIT Journal
   title: 原文标题
   url: 原文链接
   generated_at: ISO timestamp
   score: 自评分(1-10)
   ---
   [可发布内容]
   ```

8. **更新状态**：把本轮读过的内容标题/URL 写入 state.json
