# Content Loop

自迭代内容生产系统。AI 自主读取信息源、发现有趣内容、生成可发布的短内容。

## 信息源

- **arXiv**: 学术前沿论文（API 拉取）
- **SHIT Journal**: 学术恶搞/解构社区（agent-browser 爬取）

两个源独立循环，不融合。

## 工作流程

每轮循环：读取新内容 → 判断有没有意思 → 有就评估+生成可发布内容 → 存到 queue/

## 目录结构

- `arxiv-loop/` — arXiv 循环（SKILL.md + config.md + state.json + queue/）
- `shit-loop/` — SHIT Journal 循环（同上）
- `published/` — 已发布内容存档
- 每个循环独立运行，各有自己的方针和状态

## 原则

- 简单直接，不过度设计
- 先手动跑通，再自动化
- 内容质量 > 数量
- config.md 是人唯一需要改的文件
