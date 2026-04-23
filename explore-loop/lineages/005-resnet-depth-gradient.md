# 残差连接不是原创——它是 1997 年 LSTM 答案在 2015 年被重新发现

> 种子：Deep Residual Learning for Image Recognition (He et al., 2016, cited 218108)
> 方向：refs
> 谱系长度：5 篇（1 种子 + 4 前驱）

## 脉络一句话

2015 年之前，深度学习有一个越推越深的势头（AlexNet 8 层 → VGG 19 层 → GoogLeNet 22 层），但都撞上了同一堵墙——层数再加，训练 loss 反而更差，这叫 degradation problem。ResNet 的 "identity shortcut" 用一个加号解决了这个问题，但**这个加号的数学本质早在 1997 年的 LSTM 里就被 Hochreiter 发明过了**——"constant error carousel" 和 residual connection 做的是完全同一件事：给梯度开一条恒等通路，让它不被层数稀释。

## 种子

**Deep Residual Learning for Image Recognition** (He, Zhang, Ren, Sun, 2016) — 218108 引用
CNN 的叙事在 2014-2015 年卡在"深了反而更差"的反直觉现象上：VGG-19 比 VGG-16 强，但 VGG-34 比 VGG-22 弱。He 等人把这个现象命名为 **degradation**——不是过拟合（训练 loss 也更差），而是优化器在深层网络里找不到好解。他们的方案只有一行 Python：`H(x) = F(x) + x`，让每个残差块学"在输入上加什么"而不是"把输入变成什么"。152 层的 ResNet 拿下 ImageNet 2015 冠军（3.57% top-5 error），**比 VGG 深 8 倍却更容易训练**。这篇论文把 "deeper is better" 从一个有理由怀疑的信念变成了可以工业化的工程实践——后续 Transformer、BERT、GPT 的每一个 residual block 都是这篇论文的后代。
DOI: 10.1109/CVPR.2016.90 | CVPR 2016 open

## 前驱 / 相关

### Long Short-Term Memory (Hochreiter & Schmidhuber, 1997) — 95830 引用
这篇论文回答的是循环网络里的梯度消失：RNN 在时间上展开 1000 步，梯度从末端流回开端时被权重矩阵反复相乘，指数衰减到零。Hochreiter 和 Schmidhuber 的解法是 **constant error carousel**——在 cell 内部造一条线性通路，让误差沿这条路回传时既不放大也不衰减（导数恒为 1）。ResNet 的 `H(x) = F(x) + x` 和 LSTM 的 `c_t = c_{t-1} + i_t ⊙ g_t` 在梯度流动视角上**完全同构**：两者都通过一个恒等连接绕过可能让梯度失真的非线性层。2015 年 He 的贡献不是发明恒等通路这个想法，而是把它**搬到空间维度**（RNN 是沿时间，ResNet 是沿深度）并证明它同样管用。这是深度学习 20 年来少见的"跨场景复用一个老想法"的例子。

### ImageNet Classification with Deep Convolutional Neural Networks (Krizhevsky, Sutskever, Hinton, 2012) — 75671 引用
AlexNet 是现代深度学习的起点：8 层 CNN + ReLU + Dropout + 双 GPU，把 ImageNet 2012 top-5 error 从 26.2% 打到 15.3%。这篇论文做了两件奠基的事——证明**GPU 可以让 CNN 扩大一个数量级**，证明**深比浅好**（在当时 8 层已经算深得离谱）。ResNet 是 AlexNet 故事的极端终章：如果 8 层就能让错误率腰斩，152 层会怎么样？AlexNet 立下了"加深就赢"的 prior，后续四年所有架构都在回答"再加深会不会继续赢"——直到 ResNet 真正让这个问题在工程上可操作。

### Very Deep Convolutional Networks for Large-Scale Image Recognition (Simonyan & Zisserman, 2014) — 75502 引用
VGG 做了一件方法论上干净的事：把架构极简化，只用 3×3 卷积 + 2×2 池化，然后系统地增加深度（11 / 13 / 16 / 19 层），观察性能变化。结论是深一点就多涨一点——但增长速率在 16 层后明显放缓，到 19 层几乎停滞。VGG 用严谨的 ablation **给深度增长定位了天花板**，也把"为什么到 19 层就不涨了"变成深度学习社区的公开难题。ResNet 的论文第一段就是在回答 VGG 留下的这个问题：因为 degradation，不是因为 overfitting。VGG 提出症状，ResNet 给出诊断和处方。

### Going Deeper with Convolutions / GoogLeNet (Szegedy et al., 2015) — 46494 引用
GoogLeNet 在 ResNet 前一年用了 22 层拿下 ILSVRC 2014——深度进一步推进。但它的方法不是简单加深，而是 **Inception 模块**：在同一层里并行跑多个不同尺度的卷积再 concat。表面看是在讨论"多尺度特征"，实际做的是**用宽度换深度**——因为当时大家都知道再往深堆梯度会崩。Szegedy 同组 2015 年还发了 **Batch Normalization**，那是第一次系统性解决梯度分布漂移问题，也是 ResNet 能训练成功的另一个前提（ResNet 的每个残差块都内嵌 BN）。GoogLeNet 和 BN 共同证明：深度问题不是"不能更深"而是"不会训练"——这是 ResNet 出现的直接土壤。

## 一条主线

2012 AlexNet 证明 GPU + CNN + 足够深能赢 ImageNet。2014 VGG 把"深度 vs 性能"的曲线画到 19 层，曲线在 16 层后平坦。2014-2015 GoogLeNet 和 BatchNorm 意识到深度上的瓶颈是优化问题不是容量问题，尝试用结构（Inception）和归一化（BN）绕过去。这一路是**空间域**的深度学习。

另一条完全独立的线在 1997 年就已经走完一轮：RNN 的梯度消失被 Hochreiter 用 LSTM 的恒等通路解决了。这一路是**时间域**的深度学习。

2015 年 He 等人做的是**跨维度移植**：把 LSTM 里沿时间维度的 constant error carousel 翻译成沿深度维度的 residual shortcut。这个移植的效果是立竿见影的——degradation 消失，152 层的网络训练起来比 VGG-34 还稳。ResNet 之后，几乎所有深度学习架构都带 residual：Transformer 的每一层都是 residual + layer norm，这让 GPT-3 的 96 层、GPT-4 的百层级架构成为可能。

所以 ResNet 的思想史意义不是发明了 skip connection（LSTM 已有），而是**让空间域和时间域的深度学习第一次共享同一把钥匙**。后来 Attention Is All You Need (2017) 在这把钥匙上再加了一个乘号，就打开了大语言模型的门。

## 未解

- Residual connection **为什么**让优化变容易，理论解释到 2025 年仍有分歧：loss landscape smoothing（Li et al. 2018）、implicit ensemble（Veit et al. 2016）、gradient flow preservation（Balduzzi et al. 2017）——三种解释各有证据，没有一个是完备的。
- ResNet 和 LSTM 的等价性在梯度流动层面是精确的，但在**表达能力**层面未完全确认：残差网络是否在某种意义上等价于一个"展开的 RNN"？这是 2018 年之后 neural ODE 路线（Chen et al.）在回应的问题。
- Degradation problem 的"深层优化为什么会失败"这个根源问题从未被清楚回答——ResNet 是绕过它（给一条捷径），而不是解决它。

## 可复用到的选题

- **「一个加号，两次发明——恒等连接的 18 年漂流」**——从 LSTM 1997 的 constant error carousel 讲到 ResNet 2015 的 residual shortcut，再讲到 Transformer 的普适使用。一个数学操作如何在三个看似无关的场景里都变成关键。适合做"老想法的第二春"类文章。
- **「Degradation 不是容量问题，是优化问题——深度学习社区花了三年才分清」**——用 VGG→GoogLeNet→ResNet 的三步，讲"更深为什么更差"的误解是如何被一步步澄清的。适合做"概念澄清"类的技术史文章。
