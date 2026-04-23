# ConvS2S 2017——被 Transformer 遮盖的"序列并行化"平行路

> 种子：Convolutional Sequence to Sequence Learning (Gehring, Auli, Grangier, Yarats, Dauphin, 2017, cited 1904)
> 方向：refs
> 谱系长度：5 篇（1 种子 + 4 前驱）

## 脉络一句话

2014-2016 年的 NMT 一直被 RNN 架构主导（Sutskever seq2seq → Bahdanau attention → Google NMT）。但 RNN 的**时间步依赖**让训练和推理都无法有效并行化——模型变深、数据变大后，这成为工程瓶颈。Facebook AI Research 2017 年的 **ConvS2S** 试图用**堆叠卷积层**替代 RNN 做序列建模：每一层的 receptive field 随深度线性增长，但每一层内所有位置都可以**完全并行计算**。这个架构在 WMT'14 英→德达到 25.2 BLEU，比 Google NMT 快 9 倍。但 3 个月后 Vaswani 等人的 *Attention Is All You Need* 发表，证明**不用 RNN 也不用 CNN 只用 attention** 就够了——ConvS2S 的"非 RNN 路线"被 Transformer 压过。ConvS2S 是**对的方向但输了赛跑**，是 2017 年 NLP 史上最有意思的"差一步"。

## 种子

**Convolutional Sequence to Sequence Learning** (Jonas Gehring et al., 2017) — 1904 引用
发表于 ICML 2017 的这篇论文（arxiv 2017 年 5 月）是 Facebook AI Research 对 NMT 架构的一次彻底重构。核心设计：编码器和解码器都用**堆叠一维卷积层**代替 RNN，卷积核宽度 3-5，通过叠层扩大感受野。每个卷积层后接**门控线性单元（Gated Linear Units, GLU）**——Dauphin 2016 发明的一种门控机制，让 CNN 有类似 LSTM 的"信息选择"能力。**多步 attention（multi-step attention）**是另一个关键——不是像 Bahdanau 2014 那样只在最终输出做一次 attention，而是**每个解码器层都独立做一次 attention**，让深层模型能逐步 refine 翻译。WMT'14 En-De 25.2 BLEU + 训练速度 9×RNN，这在 2017 年 5 月是 SOTA。但 2017 年 6 月 Vaswani 的 Transformer 在同一 benchmark 上做到 28.4 BLEU 且更快，ConvS2S 的 SOTA 地位只保持了 **6 周**。
DOI: 10.48550/arxiv.1705.03122 | arxiv OA

## 前驱 / 相关

### Long Short-Term Memory (Hochreiter & Schmidhuber, 1997) — 95830 引用
ConvS2S 的整个动机就是"**替代 LSTM 做序列建模**"——所以 LSTM 在这里是**技术靶子**而非技术基础。LSTM 的每个时间步计算都依赖上一步输出，这种**时间展开的顺序依赖**让 GPU 上的并行化几乎不可能：一个 100 token 的序列必须串行算 100 步。ConvS2S 的全部优雅都在于放弃这个假设——用 CNN 把"过去 K 个 token"作为特征硬编码进感受野，每层内全部位置并行计算。GLU 门控是专门为补偿"没有 LSTM 的长期记忆"而发明的——它让深层 CNN 获得类似 LSTM 的 gating 能力但不丢并行性。**ConvS2S 和 Transformer 的共同哲学是"去 RNN 化"**，但给出了两种不同的替代方案：CNN 路线（ConvS2S）vs attention-only 路线（Transformer）。2019 年后的 NLP 史证明 attention-only 赢了，但 2017 年 5 月那两周 ConvS2S 看起来才是 winner。

### Finding Structure in Time (Elman, 1990) — 10728 引用
Elman 这篇 *Cognitive Science* 论文是 **RNN 作为序列模型的创世纪**——他发明了后来被叫做 **simple recurrent network (SRN)** 或 Elman network 的架构，并证明它能从字符序列里学到**词边界、语法类别、甚至语义类别**（名词/动词/人/物），**全部无监督**。这是第一次用纯神经网络做语言建模的工作。Elman 1990 直接启发了 1997 LSTM、2010 Mikolov RNN-LM、2014 Sutskever seq2seq——整个"**neural language modeling**"的 25 年路线图都可以追到这篇论文。ConvS2S 引用 Elman 1990 是因为它需要**论证自己的立场**：既然 Elman 证明了 RNN 能学语言结构，那么"不用 RNN"是否损失这个能力？ConvS2S 的答案是"CNN 的堆叠层等价于不同时间尺度的 RNN 展开"。**这是深度学习社区反复上演的辩论**——架构细节不重要，信息流动的拓扑学才是关键。

### Batch Normalization (Ioffe & Szegedy, 2015) — 15691 引用
ConvS2S 之所以能训练**13 层深的卷积网络**而不崩溃，技术基础是 2015 年以来深度网络训练的一系列工程突破，其中 **Batch Normalization** 是最关键的那一个。BN 通过在每层激活后对 batch 做均值方差归一化，解决了深度网络训练中的**internal covariate shift** 问题——让 gradient 在深层传播时保持合理尺度。ConvS2S 虽然最后用的是 **layer normalization + weight normalization** 的组合（不是原版 BN），但整个"能训练深度网络"的工程 know-how 来自 BN 引发的这波研究。Transformer 2017 年同样严重依赖 layer norm 和 residual connection——**2015-2017 年深度学习社区把"怎么训练深网络"这个问题基本解决了**，这直接推动了 2017 年前后架构创新的爆发（ResNet、DenseNet、ConvS2S、Transformer 都在这两年）。没有 BN 这类工程突破，这些架构都是空中楼阁。

### Deep Residual Learning for Image Recognition (He, Zhang, Ren, Sun, 2015) — 4667 (条目, 主版本 218108) 引用
ResNet 的 **skip connection** 对 ConvS2S 至关重要——ConvS2S 的每个卷积块都用了 residual connection 让 gradient 能跨层传播。没有 residual，13 层 CNN 在 seq2seq 任务上会 gradient vanish。**residual connection 是 2015 年之后深度网络的"万能增量"**——任何 >10 层的网络都需要它。这条 vision → NLP 的技术迁移非常典型：2012 AlexNet 证明 CNN 能做 vision，2015 ResNet 证明深 CNN 能做 vision，2017 ConvS2S 把深 CNN 迁移到 NLP，**然后 Transformer 把这套工程经验（深度、residual、layer norm）保留但换掉 CNN 核心为 self-attention**。看起来 Transformer 是全新架构，其实它的"深层 + 稳定训练"的工程底座完全承继自 ResNet。**ConvS2S 是 ResNet 到 Transformer 这条 vision→NLP 技术迁移路径上的中间节点**。

## 一条主线

2014-2016 年 NMT 的架构创新都在 RNN 框架内——Bahdanau 加 attention、Luong 改 attention 计算、Google NMT 堆深 LSTM + wordpiece、Jozefowicz 搜索 RNN 变体。到 2016 年底，**RNN 路线的工程瓶颈开始明显**：训练成本线性增长于序列长度，推理速度无法并行，BLEU 提升边际递减。

2017 年 NLP 社区有两个明确共识：**(a) 要非 RNN 架构**，**(b) 要保留 attention 这个已证明有效的机制**。Facebook 和 Google 几乎同时在做这件事，但走了不同路线。

Facebook AI Research（Gehring 等）的路线是**保留 CNN**。理由是 CNN 在 vision 领域已经有 7 年的工程积累（AlexNet 2012 → VGG 2014 → GoogLeNet 2015 → ResNet 2015），深层 CNN 的训练技术是成熟的。把 1D CNN 应用到序列（Kim 2014 TextCNN 已证明可行），加上 GLU 门控 + multi-step attention，就是 ConvS2S。2017 年 5 月论文发表时，这是 NMT 新 SOTA 且训练快 9 倍。

Google Brain（Vaswani 等）的路线是**彻底放弃 CNN 和 RNN**，只保留 attention。他们的洞察是 **attention 本身就够了**——不需要任何"局部感受野"或"时间递归"来提供位置信息，用 positional encoding 和 self-attention 就可以捕捉任意距离的依赖。2017 年 6 月 *Attention Is All You Need* 发表，比 ConvS2S 晚 6 周，但在 BLEU、训练速度、样本效率上全面压过。

**ConvS2S vs Transformer 的对比是深度学习史上最明确的"技术路线竞争"之一**——两边同年同任务同问题，答案不同，6 周内见分晓。Transformer 赢了因为：(1) self-attention 是 O(n²) 但完全并行，CNN 是 O(nk) 但层间有顺序；(2) attention 天然学到长距离关系，CNN 要堆多层才行；(3) 架构更简洁，超参更少。

但 ConvS2S 的思想没死——2018 年后的**量化感知训练、 pruning、mobile 部署**场景里，CNN 序列模型在边缘设备上仍比 Transformer 高效。2020s 的 MLPs/Mixers（FNet、MLP-Mixer）某种意义上是 ConvS2S 的回响——"不用 attention 行不行"。**ConvS2S 2017 是一个被历史遮盖但技术眼光正确的工作**——它看到了 RNN 并行化的重要性、多步 attention 的价值、深度堆叠的必要性，只是在架构选择上押错了马。

## 未解

- **为什么 attention 胜过 CNN**？从 information flow 角度看，两者各有优势：CNN 的局部性是一种 inductive bias（对短距离依赖友好），attention 的全局性能捕捉任意距离关系。2020s 的 **ConvNeXt / MaxViT 等 hybrid 架构**在 vision 领域证明 CNN + attention 组合可能比纯 Transformer 更好——但 NLP 里这个 hybrid 路线从未真正复兴。背后可能是 NLP 数据的 statistical regularity 和 vision 不同，但严格理论不清晰。
- **GLU 门控的价值**：Dauphin 2016 的 GLU 在 ConvS2S 里至关重要，但在 Transformer 里几乎没用。2022-2023 年 Llama、PaLM 开始用 **SwiGLU**（GLU 的变体）在 FFN 层，又把 GLU 的价值部分救回来。**GLU 到底在做什么**至今没有干净的数学表征。
- **多步 attention 的历史地位**：ConvS2S 的多步 attention（每层独立 attend）被 Transformer 的 multi-head attention 取代。但 2020s 的 **layer-wise attention**（如 DeBERTa、LongNet）又在每层 attention 间加入 position-relative modulation——**ConvS2S 的多步思路可能被低估**。

## 可复用到的选题

- **「2017 年 5 月到 6 月——NMT 架构的最后一次换代」**——从 ConvS2S（5 月）到 Transformer（6 月）的 6 周窗口，讲 NLP 架构史上最激烈的路线竞争。可以和 2012 年 AlexNet、2022 年 ChatGPT 并列为深度学习史的三大转折点。
- **「Attention Is Not All You Need——ConvS2S 的平反」**——2023 年以来 SwiGLU、ConvNeXt、Mamba（state-space 模型）的兴起证明"attention 之外还有路"。ConvS2S 的技术眼光在 6 年后被部分追认。适合"被遮盖的正确答案"类文章。
- **「Facebook AI Research 的失败叙事」**——FAIR 2017 年做了 ConvS2S 输给 Transformer，2018 年做了 XLM 输给 BERT，2019 年做了 RoBERTa 被 T5 压过，2023 年 LLaMA 才真正超越 Meta 竞争对手。FAIR 的研究史上有一条"对的方向但慢一步"的模式——适合研究组织社会学类文章。
