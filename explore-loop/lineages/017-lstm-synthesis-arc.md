# LSTM 的 9 年孕育——从 Hochreiter 硕士论文到 1997 *Neural Computation*

> 种子：Long Short-Term Memory (Hochreiter & Schmidhuber, 1997, cited 95830)
> 方向：refs
> 谱系长度：5 篇（1 种子 + 4 前驱）

## 脉络一句话

1986 Rumelhart-Hinton-Williams 的 backprop 让前馈 NN 走出冰封，但**循环网络**的训练是另一个 10 年难题：Pineda 1987 用统计物理方法给出 RNN 的一种不动点训练、Werbos 1988 在 RNN 上推广 BPTT（反向时间传播）、Williams-Zipser 1990 提出 RTRL（实时递归学习）——三套互不兼容的训练算法。1991 年 **Sepp Hochreiter 的慕尼黑硕士论文**独自发现这三套算法的共同病根：**vanishing / exploding gradient**——梯度在长时序上指数消亡。1994 Bengio 把这个发现数学化，判了 gradient-based RNN 学长距离依赖"死刑"。Hochreiter 1996 NIPS 和 1997 *Neural Computation* 的两篇论文给出了解药——**constant error carousel (CEC) + multiplicative gates**——梯度通过一条"恒流"线路不衰减传播。**整个 LSTM 的逻辑链条横跨 1986-1997 共 11 年**。

## 种子

**Long Short-Term Memory** (Sepp Hochreiter & Jürgen Schmidhuber, 1997) — 95830 引用
发表在 *Neural Computation* 9 卷 8 期的 32 页论文是深度学习史上被引最高的 5 篇之一。核心架构创新是 **memory cell + constant error carousel (CEC)**——每个 LSTM 单元有一个内部状态 $c_t$，通过 $c_t = c_{t-1} + (\text{input})$ 的**加性递推**让 gradient 回传时保持恒定（没有乘法衰减）。三个 gating units 控制信息流：**input gate** 决定是否写入、**output gate** 决定是否读出、**forget gate**（2000 Gers-Schmidhuber 补充）决定是否清零。论文的实验部分耐心地测试了一系列 RNN 经典 benchmark（各种 hard long-time-lag tasks），证明 LSTM 能成功学习 1000+ 步距离依赖——此前 RNN 在 10 步以上就崩溃。论文在 1997-2006 年几乎被忽视（引用增长极慢），直到 2007-2013 年 Alex Graves 的一系列工程验证才让 LSTM 进入主流（详见 lineage-015）。
DOI: 10.1162/neco.1997.9.8.1735 | MIT Press closed

## 前驱 / 相关

### Learning Long-Term Dependencies with Gradient Descent Is Difficult (Bengio, Simard, Frasconi, 1994) — 8343 引用
1994 IEEE Transactions on Neural Networks 的这篇 10 页论文是 LSTM 1997 的**理论 motivation**。Bengio 等人证明了一个 no-go theorem：在 gradient-based 学习框架下，任何 RNN 都在**长距离依赖捕获** vs **训练稳定性**之间做权衡——不能两得兼。具体地，如果 recurrent 权重矩阵的谱半径 >1，训练时 gradient 会爆炸；如果 <1，gradient 会指数衰减。"long-term memory"（谱半径 ≥1）和"stable learning"（谱半径 <1）被理论上判定为互斥。这为 LSTM **打开了设计空间**——既然"纯 gradient"走不通，就要设计一个**让 gradient 不通过标准 recurrent 权重矩阵传播**的特殊路径。这就是 CEC 的诞生逻辑——信息和 gradient 都走"绕路"（直接加性累加而非乘法递推）。**Bengio 1994 和 LSTM 1997 的关系是"不可能性证明 → 绕路设计"**——这个模式在 CS 理论里非常常见（如 NP-hardness 推动 approximation algorithm）。

### Generalization of Backpropagation with Application to a Recurrent Gas Market Model (Werbos, 1988) — 959 引用
Paul Werbos 是 backprop 发明者之一（他 1974 年 Harvard 博士论文独立发现了 backprop，但没发表英文期刊版，导致 1986 Rumelhart 被公认为发明者）。Werbos 1988 这篇在 *Neural Networks* 创刊第 1 期上的论文是 **BPTT（backpropagation through time）** 的明确陈述——把 RNN 在时间维度上展开成一个深前馈网络，然后用标准 backprop 算所有权重的梯度。这是 LSTM 训练的**底层算法基础**——Hochreiter 1997 用的就是 BPTT（截断版本）训练 LSTM。Werbos 在这篇里用的例子是"天然气市场预测"——这不是巧合，Werbos 1980s 在 NSF 资助下做经济预测，他是**最早把 NN 用在时间序列的非学术界研究者之一**。Werbos 1988 是一个被低估的节点——整个 1990s RNN 训练都建立在他的 BPTT 上。

### Generalization of Back-Propagation to Recurrent Neural Networks (Pineda, 1987) — 952 引用
Fernando Pineda 的这篇 *Physical Review Letters* 论文（发表在物理期刊而非 AI 期刊）提出了另一种 RNN 训练思路——他把 RNN 看作**动力学系统**（dynamical system），训练目标是让系统的**稳态不动点**对应期望输出，然后用 "recurrent backprop"（一种对不动点条件的 variational calculation）算梯度。Pineda 的方法和 Werbos 的 BPTT **是完全不同的两套哲学**——Werbos 把 RNN 看成有限时间展开的前馈网络，Pineda 把它看成无限时间的动力学系统。1987-1989 年 Pineda 方法在物理背景的 AI 研究者里流行，Hopfield network（1982 年 Hopfield 论文）和 Boltzmann machine 都是类似思路。**Hochreiter 1991 硕士论文实际把 Pineda、Werbos、Williams-Zipser 三套算法都分析了一遍**，发现它们共享同一个 gradient 衰减病根——**这个"跨算法的共性发现"是 LSTM 能解决所有三套算法的共同问题的原因**。

### LSTM Can Solve Hard Long Time Lag Problems (Hochreiter & Schmidhuber, 1996 NIPS) — 750 引用
这是 LSTM 的 **NIPS 版**——比 1997 Neural Computation 早 1 年，7 页 conference paper。内容是 1997 论文的压缩版：CEC + 2 gates（input/output）的架构 + 一些初步实验。重要性不在引用数，而在**它第一次公开提出 LSTM 架构**——NIPS 1996 接收，证明 MIT/Stanford 的 NN 主流社区承认这个想法是新的、有价值的。1996 NIPS 论文和 1997 Neural Computation 论文的关系是"会议版 → 期刊版"的标准 ML 发表流程。**Hochreiter 和 Schmidhuber 的合作可以追到 1992-1995 年**——Hochreiter 是 TUM (慕尼黑工业大学) 硕士生，Schmidhuber 先在 TUM 做讲师、1995 年转到 IDSIA（瑞士 Lugano 的人工智能研究所）做教授。1996 NIPS 论文是他俩合作的第一个公开成果，其后 1997 Neural Computation 是精细版。**LSTM 是一个"博士生发现 + 导师推广"的经典模式**——Hochreiter 提供核心理论洞察，Schmidhuber 提供学术话语和发表渠道。

## 一条主线

神经网络复兴（1986 Rumelhart-Hinton-Williams）之后的 10 年里，**feedforward** 和 **recurrent** 走的路完全不同。Feedforward 的 backprop 在 1987 年就成熟了——LeCun 1989 的 zip code CNN、1990s 初的 handwriting OCR 都直接用。Recurrent 却在**怎么训练** 这个问题上分裂——Pineda 1987 的 fixed-point 方法、Werbos 1988 的 BPTT、Williams-Zipser 1990 的 RTRL 三套算法谁也说服不了谁。

1990 年前后，**RNN 在学术 ML 和工业界几乎都失败了**——语音识别由 HMM-GMM 主导（1980s Baum-Welch），语言建模由 n-gram 主导（IBM 1980s），时间序列预测由 ARIMA/Kalman filter 主导。NN 唯一成功的领域是 CNN 做 vision。**RNN 被认为是"理论上诱人但工程上不行"的死路**。

1991 年 **Hochreiter 在 TUM 的硕士论文** "Untersuchungen zu dynamischen neuronalen Netzen"（动态神经网络研究）独自做了一件改变格局的事——他**系统分析了三套 RNN 训练算法的收敛性**，发现它们都遭遇 vanishing gradient 问题，而且提出了一个 CEC 式的原型解决方案（当时还很粗糙）。Hochreiter 的硕士论文是**德文写的、没发表英文版、在当时几乎没人看到**——但他提出的关键诊断和解药，5 年后以 LSTM 形式被形式化。

1994 Bengio 等人独立发现同样的问题并数学化——他们不知道 Hochreiter 的硕士论文。"vanishing gradient problem" 这个术语实际上到 1998-2000 年才稳定下来。

1995 年 Schmidhuber 从 TUM 转到 IDSIA 后，把 Hochreiter 也带过去做博士/博后。1996-1997 年的 NIPS 和 *Neural Computation* 两篇论文是 **Hochreiter 硕士论文 1991 + Bengio 1994 + Schmidhuber 指导** 的三合一产物。

2007 年 Graves 的 BLSTM 开始让 LSTM 被注意，2013 年深度学习复兴后 LSTM 成为标准，2014-2016 年成为 NLP/speech 霸主，2017 年被 Transformer 超越。**但 LSTM 的核心架构概念（gating + residual gradient path）被 Transformer 完整继承**——multi-head attention 的 softmax + add-and-norm 本质上是 gating；residual connection 就是 CEC 的直接化身。所以**Transformer 不是 LSTM 的颠覆，是它的抽象化**——gating 从显式架构变成由数据学出来的 attention 权重。

Hochreiter 和 Schmidhuber 的后续故事值得注意。Schmidhuber 从 2010s 开始频繁在论文和 Twitter 上主张 **他和 Hochreiter 的工作被学界长期低估**——包括 GAN（他说 2014 Goodfellow 抄了他 1990 年的 "predictability minimization"）、ResNet（1991 他的 "Fast Weights"）、Transformer（他的 1991 Linear Transformer 先行）。这些 claim 部分有效部分争议，但 LSTM 毫无争议是他俩的——而且被整个领域追认。**Schmidhuber 的 priority battles 一定程度上是真实贡献被遮蔽后的反弹**，这个社会学现象值得研究。

## 未解

- **LSTM 的最优 gating 设计**：1997 原版是 input + output，2000 Gers 加 forget gate（成为现代标准），2014 GRU 合并 gates 到 2 个，2016-2017 年有很多 minimalist gating 实验——**哪种 gating 真正必要**至今没统一答案，可能是任务相关。
- **Transformer 为何能"去 gating"**：LSTM 的核心是手工设计的 gating，Transformer 放弃了手工 gate 但用 attention weights 替代。**attention weights 是否是 learned gating 的一种形式**，如果是，为什么不能反过来——把 gating 硬编码让 Transformer 更高效？2023 年的 SwiGLU 在 Llama 的 FFN 层里回归了 GLU（Gated Linear Unit）——这说明"完全去 gating"可能不是最优。
- **硕士论文的定位问题**：Hochreiter 1991 硕士论文作为 LSTM 的真正起点在 ML 史上被几乎完全忽略——因为是德文、未发表、不在引用系统里。**科学史上"先驱贡献被语言和渠道遮蔽"的案例**（如 Werbos 1974 vs Rumelhart 1986 的 backprop priority）是 STS 研究者的热门话题。

## 可复用到的选题

- **「Hochreiter 1991 慕尼黑硕士论文——LSTM 真正的起点」**——把 LSTM 的思想史起点往前推 6 年到 Hochreiter 硕士论文。适合"被遮蔽的起源"类学术史文章，可以和 Werbos 1974 博士论文对比（也是被遮蔽的 backprop 起点）。
- **「LSTM 的 11 年孕育——从不可能定理到工程解药」**——以 Pineda 1987 / Werbos 1988 / Williams-Zipser 1990 三条 RNN 训练路线的分裂开头，经 Hochreiter 1991 的统一诊断 + Bengio 1994 的数学判刑，到 Hochreiter-Schmidhuber 1997 的最终解药。这是 ML 史上"理论不可能 → 绕路工程"最清晰的案例之一。
- **「Transformer 是 LSTM 的抽象化吗？」**——讨论 attention 和 gating 的深层等价性。2017 Transformer 一夜取代 LSTM 看起来是革命，但架构层面 Transformer 继承了 LSTM 的 gradient highway 思想（残差 = CEC 一次性 unroll）。SwiGLU 等 2023 回归 gating 的做法也说明这不是简单的"淘汰"。
