# GPT-3 的 few-shot 是 1997 年 Multitask Learning 的延长线

> 种子：Language Models are Few-Shot Learners (2020, cited 3029)
> 方向：refs
> 谱系长度：4 篇前驱 + 数据噪声说明

## 脉络一句话

few-shot 看上去是 GPT-3 带来的新能力，但它的学术前身是 **1997 年 Caruana 提的 Multitask Learning** —— 一个模型共享表示来做多个任务，GPT-3 只是把这个思想推到了参数够大、自动就能从 prompt 里解出任务的尺度。

## 种子

**Language Models are Few-Shot Learners** (Brown 等, 2020) — 3029 引用
175B 参数语言模型。核心贡献不是架构（还是 Transformer），而是证明了"**足够大的 LM 不需要 fine-tuning，靠 prompt 里给几个例子就能做新任务**"——few-shot learning 作为涌现能力。

## 前驱

### Multitask Learning (Caruana, 1997) — 6200 引用
**思想祖父**。Caruana 论证：一个神经网络同时学多个任务，会产生能迁移的共享表示。few-shot learning 在形式上就是"每个 prompt 把上下文当作一个新任务"——用同一个模型的同一组权重解多任务，直接延续 Caruana 的路径。

### Distilling the Knowledge in a Neural Network (Hinton 等, 2015) — 13913 引用
**转移学习的另一支**。Hinton 证明了大模型的"软概率分布"里藏着比 hard label 更丰富的信息，能把知识转到小模型。GPT-3 的 few-shot 等于是把这个过程**内化**了——知识不走蒸馏管线，直接在单次推理里通过 prompt 激活。

### Efficient Estimation of Word Representations in Vector Space (Mikolov 等, 2013) — 11735 引用
**表示学习前史**。word2vec 第一次证明"大规模无监督语料训练 → 隐式语义结构"。这是从"语言建模"走向"语言理解"的起点，GPT-3 的缩放法则完全延续这条路。

### GloVe: Global Vectors for Word Representation (Pennington 等, 2014) — 33452 引用
**表示学习的正统化**。GloVe 用全局共现矩阵把词向量做得更稳，被视为 word2vec 的补充。GPT-3 的 token embedding 本质上是这些方法的 subword 版本 + 上下文化。

## 数据噪声

OpenAlex 返回的 Top 8 里有 3 篇明显错配：
- **HISTORIAE** (Socio-Cultural Transformation as Linguistic Matter, 2019) — 研究主题跟 LM 无关，疑似 OpenAlex 错索引
- **Contextual Personal Intelligence** (2025) — 标题像 AI 但主题是个人智能，置信度低
- **Domain Randomization for sim-to-real** (2017) — 机器人领域，与 LM 无关

**同时缺席的关键前驱**：Transformer (Vaswani 2017)、GPT-2 (Radford 2019)、BERT (Devlin 2018)、T5 (Raffel 2019) 都不在 Top 8 里。可能原因：这些论文引用数高，但 OpenAlex 的全量 references 排序里它们**没进前 8**（GPT-3 的 112 条 refs 中有更新、更贴近的方法论引用把它们挤下去）。

## 一条主线

```
1997 Caruana           一个网络解多任务 → 涌现共享表示
       ↓  表示学习出现
2013 word2vec / 2014 GloVe      大规模无监督 → 隐式语义
       ↓  蒸馏思路
2015 Hinton KD          大模型知识可以被转移
       ↓  全部汇合
2020 GPT-3              缩放 + 无监督 + 多任务共享 → few-shot 涌现
```

few-shot 不是新能力，是"一个网络多任务"被 scale 触发的形式。Caruana 写在 1997 年论文结尾的一句话预言："with enough shared tasks, representations become task-general"——这正是 23 年后 GPT-3 展示的东西。

## 未解

- **涌现阈值**：GPT-3 大概在 100B 参数处出现稳定 few-shot，小模型做不到。这是 emergent capability 的第一次系统观测——但**为什么是 100B 不是 10B**？缩放法则不能回答。
- **Multitask 与 few-shot 的形式差异**：Caruana 需要显式任务标签，GPT-3 靠 prompt 暗示。暗示如何等价于标签？
- **OpenAlex 引用图质量问题**：这次 Top 8 里有 3 篇噪声，是 PDF 抽取还是 ID 误配？需要观察后续种子的情况。

## 可复用到的选题

- 「few-shot 不是新能力，是 Multitask Learning 被 scale 触发的老故事」——反直觉视角
- 「知识蒸馏 vs prompt 蒸馏」——Hinton KD 和 GPT-3 few-shot 是同一种思想的两种实现形态
- 「Caruana 1997 的预言」——翻出老论文的结论段落做当下验证
