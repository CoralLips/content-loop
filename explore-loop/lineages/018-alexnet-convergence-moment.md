# AlexNet 2012——CNN 25 年 + GPU 5 年 + ImageNet 3 年的收敛时刻

> 种子：ImageNet Classification with Deep Convolutional Neural Networks (Krizhevsky, Sutskever, Hinton, 2012, cited 75671)
> 方向：refs
> 谱系长度：5 篇（1 种子 + 4 前驱）

## 脉络一句话

2012 年 10 月 ILSVRC 图像分类竞赛结果公布时，**AlexNet 的 top-5 error 是 15.3%，第二名是 26.2%——10 个百分点的断崖**。这不是一个算法突破，是三股独立 25 年线程在同一时刻的交汇：(a) **CNN** 从 LeCun 1989 Bell Labs 的 ZIP code 识别开始，在手写字符 / 人脸识别等小任务上慢慢成熟；(b) **GPU 加速**从 2007 CUDA 发布开始让矩阵乘法突然变便宜；(c) **ImageNet** 数据集从 2007 Fei-Fei Li 开始手工标注到 2009 年公开发布。2012 年 9 月多伦多大学博士生 Krizhevsky 用两块 GTX 580 训练 5 天完成的一个 60M 参数 CNN，成为深度学习时代的开端。**AlexNet 的神奇不在于它发明了什么，而在于它**证明**了这三个线程的组合在 ImageNet 上能 work**。

## 种子

**ImageNet Classification with Deep Convolutional Neural Networks** (Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton, 2012) — 75671 引用
这篇 NIPS 2012 的 9 页论文（2017 年被 ACM Communications 转载，DOI 重指到 3065386）是深度学习史上的**奇点论文**。核心架构：5 层卷积 + 3 层全连接，约 6000 万参数，输入 224×224 RGB 图像，输出 1000 类分类。关键工程：(1) **ReLU 激活**替代 tanh/sigmoid，让深网络能快速训练；(2) **Dropout** 正则化，防止过拟合；(3) **两块 GTX 580 GPU 并行**，每块 3GB 显存分担不同半个网络；(4) **Data augmentation** + PCA color jitter 增加有效数据量。**最震撼的是效果**——ILSVRC-2012 top-5 error 15.3%，远超第二名 26.2%（传统 SIFT+SVM pipeline）。这个 10 个百分点的断崖让 CV 社区 1 年内几乎完全转向深度学习——Andrej Karpathy 在斯坦福的 ILSVRC post 著名地写道："之后谁还用 SIFT？"AlexNet 之后 1 年（ILSVRC-2013）所有 top-10 都是 CNN；2 年后 ResNet 把 top-5 error 压到 3.5% 超过人类（5.1%）。
DOI: 10.1145/3065386 | ACM OA

## 前驱 / 相关

### ImageNet: A Large-Scale Hierarchical Image Database (Deng, Dong, Socher, Li, Li, Fei-Fei, 2009) — 60864 引用
这是 AlexNet **最关键的前驱**——没有 ImageNet 就没有 AlexNet。2006 年 Fei-Fei Li 从普林斯顿转到斯坦福后启动 ImageNet 项目——目标是构造一个**覆盖 WordNet 所有名词概念**（约 10 万个类别）的大规模图像数据集。核心工程问题是**标注**：手工标注一千万张图需要 10 人年的人力。Fei-Fei Li 的关键创新是用 **Amazon Mechanical Turk**（AMT）——把标注任务拆成小 HITs（Human Intelligence Tasks）分发给全球众包工人。2009 CVPR 的这篇论文宣布 ImageNet 公开 3.2 million 图、5247 synsets。2010 年 ILSVRC（ImageNet Large Scale Visual Recognition Challenge）启动，1000 类 + 每类 1000 图。**没有 ILSVRC 的 benchmark 竞争，AlexNet 不会存在**——Krizhevsky 做 AlexNet 的整个 motivation 就是"我能不能赢 ILSVRC"。ImageNet + ILSVRC 也是 CV 社区第一个**统一 benchmark**——此前各实验室各用各的数据集，不可比。**统一 benchmark 带来的可比性 + 竞争压力**加速了 2010s CV 的进展，这是研究社会学的经典案例。

### Learning Multiple Layers of Features from Tiny Images (Krizhevsky, 2009) — 25469 引用
这是 Krizhevsky 本人在多伦多大学做硕士生时的 tech report，**CIFAR-10 / CIFAR-100 数据集的发源地**。文中他构造了一个 60000 张 32×32 小图的 10/100 类数据集，用它训练不同 NN 架构（RBM、autoencoder 等），探索**深度网络的特征学习能力**。技术上没有 AlexNet 级突破——他用的是 unsupervised pretrain + fine-tune 的 2009 年主流，准确率 20-30%。但这份 tech report 的真正重要性在于它是 **Krizhevsky 积累 CNN/GPU 训练经验的实验室**。从 CIFAR 32×32 小图到 ImageNet 224×224 大图，只是 scale 的放大（加上 GPU 加速）——AlexNet 的核心工程 know-how 在 CIFAR 上已经练过一遍。**CIFAR 数据集本身**也成为 2010s CV 研究的标准 benchmark，从 2012 Dropout 到 2015 ResNet，每个新 CNN 架构都先在 CIFAR 上验证。2017 年 Krizhevsky 离开 Google 去独立研究后，CIFAR 仍然是他 2020 年的主要工作对象——**一个研究者和一个数据集之间的 20 年关系**。

### Rectified Linear Units Improve Restricted Boltzmann Machines (Nair & Hinton, 2010) — 13237 引用
ReLU（$f(x) = \max(0, x)$）作为激活函数**不是 AlexNet 发明的**——Nair 和 Hinton 在 2010 ICML 的这篇论文第一次**正式**提出用 ReLU 代替 sigmoid 训练 RBM。更早还能追溯到 Fukushima 1980 的 Neocognitron 和 1960s 神经科学的 "half-wave rectification" 概念。但 Nair-Hinton 2010 是**第一次在 deep net 训练语境里论证 ReLU 的价值**——它的 gradient 不饱和（sigmoid 在两端 gradient 接近 0），所以深网络梯度传播好；稀疏激活（一半神经元输出 0）对正则化和特征分离有益。AlexNet 直接用了 ReLU 并证明了它在**超大规模深网络**上的决定性效果——训练速度比 tanh 快 6 倍。**ReLU 之后成为所有深网络的默认激活**，一直到 2017 Swish、2020 GELU 才开始有实质挑战。"换一个激活函数解决所有深度训练问题"这种简单到近乎玄学的现象是深度学习史上的反复主题——ReLU、BatchNorm、residual connection 都是几行代码级改动但带来断层效果。

### Handwritten Digit Recognition with a Back-Propagation Network (LeCun et al., 1989 NIPS / 1990) — 3635 引用
这是**CNN 的真正起点**——比 AlexNet 早 23 年。LeCun 在 Bell Labs 把 Fukushima 1980 Neocognitron 的想法（**权重共享 + 局部感受野**模仿视皮层 V1 简单细胞）和 backprop 结合，做出第一个用 backprop 训练的 CNN——识别 USPS 邮政编码。这篇 NIPS 1989 论文和 1989 *Neural Computation* 版本（lineage-013 引用）合起来构成了 CNN 的创世纪。LeCun 的核心洞察：**图像具有平移不变性**——一个猫不管在左上角还是右下角都是猫，所以同一个特征探测器应该在图像的每个位置都工作，这就是 weight sharing。1990s LeCun 的 **LeNet-5** 在美国银行用来自动识别支票上的手写数字，是商业成功的最早 CNN。但 1990s 末到 2010s 初 **CNN 在 vision 主流上几乎消失**——SIFT（Lowe 1999）+ SVM 变成主流，CNN 只在手写识别等极小众场景里生存。**AlexNet 是 LeCun 1989 这条线的复兴**——同样的权重共享、同样的局部感受野、同样的 backprop，只是层数从 5 层加到 8 层、输入从 28×28 加到 224×224、参数从 60K 加到 60M。**AlexNet 在架构层面几乎是 LeNet-5 的 scale-up**——这是深度学习"bigger 就是 better" 哲学的第一个有力证据。

## 一条主线

CNN 的历史是一条**被遗忘又被重新发现**的曲线。1980 Fukushima 的 Neocognitron 提出了 weight sharing + 局部感受野，但没用 backprop。1989 LeCun 在 Bell Labs 用 backprop 训练 Neocognitron 风格的网络，做出第一个工作的 CNN。1990s LeCun 的 LeNet-5 在美国邮政和商业银行部署，**第一次把 NN 变成商业产品**。但 1995 Vapnik 的 SVM 论文发表后，**kernel methods 主导 1995-2005 年机器学习**——CNN 被认为是 "engineering hack"，不如 SVM 数学优雅。1999 Lowe 的 SIFT 特征进一步确立了 **hand-designed features + SVM** 作为 vision 的 de-facto 方法。

2006 Hinton 等人的 **deep belief network** 论文重新点燃对深度 NN 的兴趣，2006-2010 年 Hinton、Bengio、LeCun 三个实验室独立做了大量 deep learning 的奠基工作——unsupervised pretraining、autoencoder、RBM、dropout 等。但这些工作**在 benchmark 上并没有碾压 SVM**——2010 ImageNet 第一届 ILSVRC 的冠军仍是传统 SIFT+SVM pipeline。

2007 年的 **CUDA 和 2011 年的 Theano** 让 GPU 通用计算进入 ML 研究者手中。2009 年 Raina、Madhavan、Ng 用 GPU 训练大规模 RBM，证明 GPU 比 CPU 快 70 倍。2010 Dan Ciresan（在 Schmidhuber 组）用 GPU 训练深 CNN 在 MNIST 达到人类水平——**这是 AlexNet 的直接技术前驱，但几乎没被引用**。

2012 年所有条件收敛：(a) ImageNet 数据集大规模可用，(b) GPU 训练深 CNN 成本可承受，(c) ReLU + Dropout 等工程技术成熟。Krizhevsky 9 月和 10 月的两个月里在 Hinton 实验室里训练了 AlexNet——一台双 GTX 580 机器，大约 $3000 硬件，运行 5-6 天。9 月 30 日 ILSVRC 2012 结果公布，AlexNet 15.3% vs 第二名 26.2%。10 月在佛罗伦萨 ECCV 的 ImageNet workshop 上 Krizhevsky 展示结果，**现场的 CV 大佬们集体震惊**——SIFT 的时代结束了。

AlexNet 2012 的思想史位置是**深度学习时代的 Sputnik 时刻**——它不是最 fundamental 的论文（那是 LeCun 1989 或 Hinton-Rumelhart 1986），但它是**公众和产业看到深度学习威力的第一个时刻**。Google、Facebook、Baidu 从 2013 年开始大规模招募深度学习人才，Hinton 2013 年把他实验室卖给 Google（Krizhevsky 和 Sutskever 也去了 Google），2014 年 Facebook 挖来 LeCun 建 FAIR。**AlexNet 之后 18 个月内，所有大科技公司都把深度学习放入 roadmap**——这是科技史上最快的一次产业范式转移之一。

## 未解

- **为什么是 2012 年**？ImageNet 2009 年发布、CUDA 2007 年发布、ReLU 2010 年 Nair-Hinton、Dropout 2012 年 7 月 Hinton 预印。所有条件在 2011 年就齐备了——Dan Ciresan 2011 年的 GPU CNN 论文实际已经做出 MNIST 人类水平。**为什么 AlexNet 等到 2012 年？**部分原因是 Krizhevsky 需要时间写代码（cuda-convnet 是他手写的 CUDA kernel），部分原因是 ImageNet 2012 版本数据才够稳定。但也有"需要一个夸张的胜利margin 才能说服学界"这个社会学因素。
- **AlexNet 有多少是架构 + 多少是工程 know-how**？在后 10 年的"复现 AlexNet"尝试里，很多研究者发现**复现准确率**需要极精细地匹配 Krizhevsky 原版的每一个超参、data augmentation、learning rate schedule——换一种超参就掉 5-10 个百分点。**这说明什么 matters 其实是 implicit 的工程 recipe，而非公开论文里的架构描述**——这是深度学习复现危机的源头之一。
- **Ciresan vs AlexNet 的信用分配**：Dan Ciresan 2010-2011 年在 Schmidhuber 组做了几乎所有 AlexNet 的核心技术（GPU CNN、多 GPU 训练、data augmentation），但他的论文影响力远不如 AlexNet。**为什么 Hinton 组的 AlexNet 成了历史节点而不是 Schmidhuber 组的 Ciresan**——数据集选择（ImageNet vs MNIST）是关键因素，但学术话语权和媒体曝光也起作用。Schmidhuber 在 2015 年后反复在 twitter 上抱怨这个 priority 问题。

## 可复用到的选题

- **「AlexNet 不是一个想法的胜利，是三股 25 年线程的交汇」**——用 CNN（LeCun 1989）、GPU（CUDA 2007）、ImageNet（Fei-Fei Li 2007-2009）三条独立线程讲 AlexNet 的"时势英雄论"。适合"偶然还是必然"类科学史讨论。
- **「Dan Ciresan 的平行宇宙——如果 2011 年他赢了 ILSVRC」**——反事实想象：如果 2011 年 ILSVRC Ciresan（在瑞士 Schmidhuber 组）的 GPU CNN 拿了冠军，今天深度学习的领导者会是 Schmidhuber 而非 Hinton。**信用分配在科学史上的偶然性**是一个严肃议题。
- **「Fei-Fei Li 和手工标注的赌博——2006 年没有人相信 ImageNet 能完成」**——ImageNet 项目的故事：Fei-Fei Li 2006 年启动时几乎没有人相信"标注千万图"可行，NIH 拒绝资助。她靠 Amazon Mechanical Turk 众包完成了标注——这个"用人力解决数据集"的路线在 2006-2012 年被视为古老笨拙，到 2022 年 RLHF 时代反而回归主流。
