# 机器翻译的 12 年 → 11 个月 → Attention Is All You Need 的序章

> 种子：Effective Approaches to Attention-based Neural Machine Translation (Luong, Pham, Manning, 2015, cited 8543)
> 方向：refs
> 谱系长度：5 篇（1 种子 + 4 前驱）

## 脉络一句话

机器翻译从 1990 年代开始由"**基于统计短语的 SMT**"主导，Koehn 2003 是这套技术的教科书峰顶——靠对齐概率和短语表运行了 10 年没有实质突破。2014 年一年内发生了三件事：Sutskever 证明 LSTM 编解码器能直接做 MT，Cho 提出门控 RNN 编解码器，Bahdanau 识别出"固定长度向量是瓶颈"并发明 attention。Luong 2015 是这轮突破后的**首次工程优化**——把 attention 从 concept proof 打磨成工业配方。两年后的 Transformer 论文把 attention 推到极限，删掉 RNN 只留 attention，这才有了 GPT/BERT 的时代。

## 种子

**Effective Approaches to Attention-based Neural Machine Translation** (Luong, Pham, Manning, 2015) — 8543 引用
Bahdanau 2014 的 attention 机制一出现就被整个 NLP 领域抢着复用，但它的具体形式并非唯一——Bahdanau 用的是**additive / concat** 风格（用一个小 MLP 算对齐分数）。Luong 这篇论文做的事情朴素但关键：**系统比较 global vs local attention，dot-product vs general vs concat 三种打分函数**，并给每种推荐最佳超参。最终 dot-product attention 被证明效果最好（这个选择直接被 Transformer 继承）。论文的 WMT'15 En→De 25.9 BLEU 当年是新 SOTA。这篇论文没发明任何新机制，但它**把 Bahdanau 的原型工程化**——attention 能成为 2017 Transformer 里的标准组件，靠的是 Luong 这一轮打磨。
DOI: 10.18653/v1/D15-1166 | ACL Anthology open

## 前驱 / 相关

### Statistical Phrase-Based Translation (Koehn, Och, Marcu, 2003) — 3276 引用
这篇论文奠定了 2003-2014 年间**机器翻译的正统范式**——把源语言切成短语，用大规模对齐语料统计短语翻译概率和 reordering 概率，解码时用 beam search 找最大概率组合。Koehn 自己后来做的 **Moses** 开源工具包是 2005-2014 年整个学术界和工业界的 de-facto MT 系统，Google Translate 的第一代、微软 Bing 翻译、商用 SDL 都基于这个框架。Luong 2015 的论文实验 baseline 就是 Moses。NMT 要取代 SMT 不是靠"翻译更准"（初期 BLEU 差不多），而是靠**更简单的架构 + 更少的人工工程**——Koehn 2003 的一整套短语表、对齐模型、n-gram LM、reranker、后处理，到 2014 年全部被一个 encoder-decoder 替代。这是一个**以简化为卖点**的范式替换，非常罕见。

### Sequence to Sequence Learning with Neural Networks (Sutskever, Vinyals, Le, 2014) — 13334 引用
2014 年 9 月 Google 这组三人发了第一篇把**深度 LSTM 编解码器**用在机器翻译上的论文。架构极简：用一个多层 LSTM 读源句（encoder），读完输出一个固定维度向量；再用另一个多层 LSTM 从这个向量解码出目标句（decoder）。WMT'14 英→法 BLEU 34.8，首次**不用统计短语表就和 SMT 打平**（SMT 基线 33.3）。一个技术细节在论文里被提到、后来影响巨大：**把源句反转输入**能提高 BLEU 5-10 点——这是因为"固定向量瓶颈"在长句子上很严重，反转让目标端前几个词更靠近信息。Sutskever 自己**没有从这个观察得出"用 attention"的结论**——下一步是 Bahdanau 做的。

### Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation (Cho et al., 2014) — 24073 引用
几乎同一时间（2014 年 6 月，比 Sutskever 早 3 个月），Bengio 组的 Cho 和几个学生提出了**用 RNN encoder-decoder 作为 SMT 的一个特征** —— 即让神经网络给候选翻译打分，作为 Moses 的一个 feature 函数。这篇论文还顺便发明了 **GRU（gated recurrent unit）**——LSTM 的简化版，成为 2014-2017 年主流 RNN 单元之一。关键贡献不是性能（只比 Moses 好一点点），而是**证明了 encoder-decoder 架构能用于翻译评分**。Sutskever 2014 在这个基础上推到 end-to-end 翻译，Bahdanau 在同一个组里（和 Cho 同门下）下一步做了 attention。这三篇 2014 年论文像一个接力棒——Cho 9 月 → Sutskever 9 月 → Bahdanau 9 月，都出现在同一个 EMNLP 会议前后。

### Neural Machine Translation by Jointly Learning to Align and Translate (Bahdanau, Cho, Bengio, 2014) — 14596 引用
2014 年 9 月 Bahdanau 发现了 Sutskever 2014 的致命弱点：**固定长度向量在长句子上崩溃**。他的论文标题明确：让模型"联合学习对齐和翻译"——在解码每个目标词时，模型**动态回头看源句的相关部分**，通过一个 softmax 权重分布（这就是 attention）。这个动作把"固定向量瓶颈"彻底消除，长句子 BLEU 从 SMT 水平直接超过。但更大的影响在概念层：**attention = 对输入的可微可学习选择**——这个概念从此不限于 MT，传遍 speech（2015 Chan et al.）、vision（Xu 2015 Show Attend Tell）、memory networks、pointer networks。2017 Vaswani *Attention Is All You Need* 把这一切推到极致——**删掉 RNN，只留 attention**——才真正统治 NLP 至今。Bahdanau 2014 是整个"attention 时代"的奇点。

## 一条主线

2003-2013 年的机器翻译叙事是**统计工程的胜利**——Koehn 2003 的 phrase-based SMT + Moses 工具链让研究者通过改进对齐、增加短语表、调语言模型来刷 BLEU。但这个范式从 2008 年起 BLEU 涨幅就明显放缓，改架构换特征都是零点几分的边际收益。

2013 年 Mikolov 的 word2vec 让向量表征进入 NLP 主流，2013 年底 Kalchbrenner 和 Blunsom 的 "Recurrent Continuous Translation Models" 第一次给出 NMT 原型但被学界忽视。真正的爆发发生在 **2014 年下半年**：

- **6 月：Cho** 在 EMNLP 投稿——用 RNN encoder-decoder 给 SMT 打分，副产品 GRU。
- **9 月：Sutskever** 在 NIPS 投稿——端到端 LSTM seq2seq，首次不用 SMT 框架就做到 SOTA 级翻译。
- **9 月：Bahdanau** 在 ICLR 投稿——识别固定向量瓶颈，发明 attention。

这三篇论文**在 3 个月内发完**——Cho 和 Bahdanau 在 Bengio 同一个实验室，Sutskever 在 Google 远程与 Hinton 合作。它们合起来把机器翻译从一个"需要 n 个子系统配合"的工程项目变成了"**一个模型端到端学习**"的深度学习应用。2014 年 12 月 NeurIPS 的 NMT workshop 上几乎所有人都看到了这一跃迁的意义。

2015 年的任务是**工程化**——把这三篇论文里的 prototype 打磨成可部署、可复现、超参稳健的配方。Luong 2015 就是这个阶段最重要的一篇——它让 attention 不再是论文里的单个方案，而是有三种具体形式、各自适用场景、带超参建议的**工程组件**。2016 Google 的 GNMT（Wu et al., 5653 引，lineage-001 中待处理）把这套配方上线到 Google Translate，SMT 至此被彻底取代。2017 Transformer 删除 RNN 后，attention 变成 NLP 的通用硬件。

所以 Luong 2015 的思想史位置是**一个平凡但关键的桥**——它不像 Bahdanau 那样开创一个新概念，也不像 Vaswani 那样推翻旧架构；它在 attention 从"神奇新发明"到"标准组件"的转化过程中做的是**驯服的工作**。很多真正改变工业界的工作都是这种"平凡桥梁"——它们被学术史忽视，但没有它们后续革命就没地方落脚。

## 未解

- Luong 2015 推荐的 **dot-product attention** 在 2017 Transformer 里被 scaled dot-product 精调后成为标配。但 attention 的几种变体之间的**理论关系**（additive vs multiplicative，global vs local，单头 vs 多头）至今没完整统一——各种 benchmark 上互有胜负，没有"干净的理论最优"。
- NMT 取代 SMT 是 2014-2016 年的故事，但 **2023-2024 年出现了反过来的信号**——LLMs 直接做 MT（GPT-4 翻译能力）已经超过所有专门 NMT 系统。这意味着 NMT 作为一个**独立子领域**可能在慢慢消失，attention 已经代谢掉了它所依存的 "MT = 专门模型"前提。
- Bahdanau-Cho 2014 的 attention 本质上是 **learnable pooling**——把源句按相关性加权求和。但为什么这个简单操作对几乎所有序列建模问题都管用，至今没有 first-principles 解释。"attention approximates set-function on tokens"（DeepMind 2020s）是方向之一，还未完成。

## 可复用到的选题

- **「2014 年的三个月——NMT 怎么在一个季度里完成了 10 年的进展」**——写一篇密集范式替换的案例：Cho 6 月、Sutskever 9 月、Bahdanau 9 月——Bengio 实验室和 Google 的这三篇论文合起来杀死了 SMT。这种"领域级相变"在技术史上不多见，可和 2012 AlexNet 对比。
- **「attention 不是 2017 年的发明」**——很多 ML 从业者以为 Transformer 是 attention 的起点。事实上 Bahdanau 2014 就已经发明了 attention，Luong 2015 把它工程化，Vaswani 2017 只是"把 attention 作为唯一机制"推到极限。搞清这段 3 年脉络有助于理解 attention 到底是什么。
- **「平凡桥梁是如何被历史忽视的——Luong 2015 的功劳」**——用 Luong 2015 做案例，讲"范式革命"叙事里被遮蔽的"工程化工作"。大部分改变工业界的技术不是革命性论文，而是在革命和落地之间的那些把机制变成配方的论文。
