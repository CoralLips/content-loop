# Faster R-CNN 2016——object detection 从 200ms 到 5fps 的 2 年工程突围

> 种子：Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks (Ren, He, Girshick, Sun, 2016, cited 53230)
> 方向：refs
> 谱系长度：5 篇（1 种子 + 4 前驱）

## 脉络一句话

2014 年 Girshick 的 R-CNN 证明 CNN 能做 object detection，把 Pascal VOC mAP 从 35% 推到 53.7%——但每张图需要 **47 秒**，完全不能实时。接下来 2 年是 R-CNN 家族的**工程突围**：Fast R-CNN (2015) 用 RoI Pooling 让 region 共享 CNN 特征，从 47s 降到 2.3s（20×）；Faster R-CNN (2016) 用 **Region Proposal Network (RPN)** 替换 Selective Search，从 2.3s 降到 0.2s（再 10×）——**object detection 从 academic prototype 终于变成 production-ready 技术**。这 2 年的 R-CNN 三代演化是深度学习时代**把学术算法工程化**最清晰的案例，每一代都通过消除一个具体 bottleneck 达到 10× 加速。

## 种子

**Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks** (Shaoqing Ren, Kaiming He, Ross Girshick, Jian Sun, 2016) — 53230 引用
这篇 IEEE TPAMI 2017 版（arxiv 2015 年 6 月 NIPS 2015）由**微软亚研院 (MSRA) + FAIR 联合**产出。核心贡献是 **Region Proposal Network (RPN)**——一个小型 CNN 滑过 backbone feature map，在每个位置对 **9 个 anchor boxes**（3 个尺度 × 3 个长宽比）预测 "objectness score + bounding box regression"。RPN 共享 backbone（VGG-16 或 ZF 等）的卷积特征，所以 **near-zero 额外成本**。然后 Fast R-CNN head（RoI Pooling + classifier）在 RPN 提议的候选框上做最终分类。整个管线 end-to-end 训练，用一种"4 步交替训练"（先 RPN、再 Fast R-CNN、再 fine-tune RPN 共享层、最后 fine-tune Fast R-CNN）。Pascal VOC mAP 73.2%，COCO AP 21.9%，运行速度 5-17 fps（取决于 backbone）——**第一个接近实时的高精度 detector**。Faster R-CNN 后来演化为 Mask R-CNN (2017)，是 instance segmentation 的 de-facto 方法。直到 2020 年 Detectron2、MMDetection 的大部分 detector 都基于 Faster R-CNN 骨架。
DOI: 10.1109/tpami.2016.2577031 | IEEE closed

## 前驱 / 相关

### Rich Feature Hierarchies for Accurate Object Detection and Semantic Segmentation (Girshick, Donahue, Darrell, Malik, 2014) — 31455 引用
**R-CNN**——Girshick 博士 2014 CVPR 论文，**R-CNN 家族的第一代**。技术思路：(1) 用 **Selective Search**（一种 hand-crafted 图像分割算法）生成 ~2000 个 class-agnostic 候选框 / 图；(2) 把每个候选框 warp 成 227×227 输入；(3) 用 AlexNet-pretrained CNN 提 4096-d 特征；(4) 每个类别用 linear SVM 分类 + bounding box regression 精修。Pascal VOC 2010 mAP 53.7% vs 传统 DPM 的 35%——detection 领域的 AlexNet 时刻。但 **严重慢**——Selective Search 2s/图 + CNN 45s/图（每个候选框独立走 CNN，没有共享）。R-CNN 证明"CNN 能做 detection"，剩下问题是怎么加速。**Girshick 自己**意识到架构的两个 bottleneck：(a) 候选框间特征重复计算；(b) Selective Search 慢且不可训练。2015 Fast R-CNN 解决 (a)，2016 Faster R-CNN 解决 (b)。一个研究者 2 年完成一个家族的**三代设计**，这在 CV 史上是少见的"单人主线推动"。

### Very Deep Convolutional Networks for Large-Scale Image Recognition (Simonyan & Zisserman, 2014) — 75502 引用
与 lineage-019 共享。VGG 在 Faster R-CNN 里的角色是 **feature backbone**——Faster R-CNN 的实验用 ZF（快但精度低）和 VGG-16（慢但精度高）两种 backbone，VGG-16 版本的 mAP 显著更高。**VGG-16 在 2014-2017 年几乎是所有 R-CNN 家族论文的默认 backbone**——因为 VGG 的 224×224 输入 + 规整 conv 层容易改造成 detection 输入（任意分辨率）。这也是 VGG 对 CV 研究生态影响的具体体现：**一个好 backbone 让无数下游任务加速**。2017 年 ResNet-101 backbone 开始在 Faster R-CNN 里替换 VGG——因为 ResNet 更深更准，但 VGG-based Faster R-CNN 在 2020 年前仍是 baseline 标配。"backbone + task head"这个 CV 范式可以追溯到 R-CNN 家族的设计哲学——**特征提取可以共享，任务头可以多样**。这条哲学延伸到 2020s 的 foundation model（预训练 backbone + 任务 head fine-tune）几乎没变。

### Microsoft COCO: Common Objects in Context (Lin et al., 2014) — 41459 引用
**MS COCO** 是 ImageNet 之后的**第二个 CV 大数据集奠基工作**。2014 年微软研究院的 Tsung-Yi Lin 等人发布 COCO——33 万张图，80 物体类别，150 万物体实例 + 物体级 segmentation mask + image caption。比 Pascal VOC（11K 图 / 20 类）大 30×，比 ImageNet classification（单类别标签）细粒度得多。COCO 的关键设计：**物体在 context 中**——不是裁好的物体肖像而是日常场景，和每物体的**像素级 mask**（不只是 bbox）。COCO 的 mask annotation 让 2017 年 Mask R-CNN 的 instance segmentation 成为可能。**benchmark 数据集推动算法演化**是 CV 领域最可靠的模式——ImageNet 推动分类 CNN（2012-2016），COCO 推动 detection 和 segmentation（2016-2020），ADE20K 推动语义分割（2017-2020）。Faster R-CNN 在 COCO 上的 21.9% AP 是 2016 年的 SOTA——之后的每代 detector 都用 COCO 作为 benchmark 竞争场。**没有 COCO benchmark，R-CNN 家族的 3 代演化不会有明确方向**。

### Fully Convolutional Networks for Semantic Segmentation (Long, Shelhamer, Darrell, 2015) — 36528 引用
**FCN** 是 CNN 在 semantic segmentation 上的开山之作——Long 等人（和 Girshick 同属 UC Berkeley Darrell 实验室）2015 CVPR 论文。核心洞察：**全连接层本质上是 1×1 卷积**——可以把 VGG-16 最后的 fc6/fc7/fc8 全连接层改写成卷积层，让整个网络支持任意分辨率输入、输出密集预测。具体做法：VGG-16 变成 "fully convolutional"，把 224×224 分类输出扩展成 512×512 语义分割图。技术上简单但效果 strong——Pascal VOC-2012 mIoU 62.7%，远超之前的 手工特征 + CRF 方法。**FCN 和 R-CNN 是同实验室同时期的两条线**——Darrell 组同时推动 CNN 应用到 detection (R-CNN) 和 segmentation (FCN)，这两条线到 2017 年在 Mask R-CNN 里**合流**（Faster R-CNN + mask prediction branch = instance segmentation）。Darrell 实验室 2014-2017 年这 4 年的 CNN-for-CV 工作几乎重塑了计算机视觉的所有子任务。

## 一条主线

2012 AlexNet 之后，CV 社区面对一个清晰的工作议程：**把 CNN 用到每个 CV 子任务**。但 detection 是**最难迁移的子任务**——classification 是 "1 image → 1 label"，detection 是 "1 image → N bounding boxes + N labels"。变长输出打破了 CNN 的 fixed-size 假设，需要架构创新。

2013 年 OverFeat (Sermanet et al.) 是第一个尝试——用 sliding window 在 CNN feature map 上做 detection，但慢且不准。2014 R-CNN 的 Girshick 做了一次关键架构选择：**用 region proposal + CNN classification 替代 sliding window**——不全图扫描而是先选候选区域再分类。这个选择让 detection 从不可行变成可能。

但 R-CNN 的**性能代价**是每个图 47 秒。这在学术实验（"paper mAP"）里可接受，但工业应用（无人车、视频监控、移动端）完全不可能。Girshick 接下来 2 年几乎只做一件事——**把 R-CNN 做快**。

**2015 Fast R-CNN**：关键创新是 **RoI Pooling**——所有候选框共享同一个 CNN 特征图，每个候选框只需要在最终 feature map 上做一次 pooling 提取固定维度向量。消除了"每个 region 独立走 CNN"的冗余。速度 20×，2.3s/图。但 Selective Search（2s/图）成为新 bottleneck——**Fast R-CNN 暴露了 Selective Search 的不可扩展性**。

**2016 Faster R-CNN**：关键创新是 **Region Proposal Network (RPN)**——用 CNN 自己预测候选框，替代 hand-crafted Selective Search。RPN 共享 backbone，几乎零额外成本。速度再 10×，0.2s/图即 5fps。**整个 detection pipeline 第一次 end-to-end 用深度学习**——数据进去，检测框出来，中间没有 hand-crafted 组件。

R-CNN 家族的 3 代演化是深度学习时代**工程突围的教科书案例**。每一代都：
- 识别一个具体 bottleneck（feature 重复、region proposal 外部、backbone 瓶颈）
- 设计一个针对性 architectural change
- 在同一 benchmark 上验证 10× 加速 + 精度保持或提升
- 为下一代留下新 bottleneck

2017 **Mask R-CNN**（He, Gkioxari, Dollár, Girshick）是这条线的自然延伸——在 Faster R-CNN 上加一个 mask prediction branch，让 instance segmentation 成为同一框架的副产品。到 2020 年这条 R-CNN 家族的演化基本完成——Detectron2 和 MMDetection 成为 detection 的 de-facto 工具。

**但 R-CNN 家族 2016 后开始被挑战**——**单阶段 detector** (YOLO 2016、SSD 2016、RetinaNet 2017) 不用 region proposal 而是直接在 feature map 上做 dense prediction，速度 30-60 fps。**两阶段（R-CNN 家族）vs 单阶段（YOLO 家族）的 competition** 2016-2020 年持续——两阶段更准，单阶段更快，各有场景。2020 年后 **DETR** 用 Transformer 直接做 set prediction 为 detection，又换了一次范式。

Faster R-CNN 2016 的思想史位置是**object detection 从 academic 到 production 的转折点**——它不是最早的 CNN detector（那是 R-CNN 2014），不是最快的（YOLO 更快）——但它是**第一个同时精准、快速、end-to-end 可训练**的 detector。这让 detection 变成商业基础设施——Tesla Autopilot、淘宝图像搜索、Instagram 照片标签都依赖 Faster R-CNN 家族或其继承者。

## 未解

- **两阶段 vs 单阶段之争**：Faster R-CNN 是两阶段 detector 的代表，2016-2018 年占 SOTA；YOLO/SSD/RetinaNet 单阶段在速度上赢。2019 FCOS、CornerNet 等 anchor-free 方法又加入一条路线。**为什么没有绝对最优**？可能是不同应用场景（精度优先 vs 速度优先）对架构有不同要求，但理论上没有 no-free-lunch 级别的证明。
- **DETR 用 Transformer 替代整个 R-CNN 管线**（Carion et al. 2020），端到端用 set prediction + bipartite matching。这被认为是 detection 的"Transformer 化"。但 DETR 训练慢（需要 500 epoch），2021-2023 年的 Deformable DETR、DINO 等一堆改进试图加速。**R-CNN 和 DETR 哪个更根本**，还未见终局。
- **Anchor 的必要性**：Faster R-CNN 用 9 个 anchor boxes 作为 RPN 的 positive proposal 基础。但 anchor 的尺度、长宽比、数量都是超参，不好调。Anchor-free 方法（FCOS、CenterNet）已证明不用 anchor 也能工作。**anchor 到底是一个有效 inductive bias 还是一个历史包袱**，仍是开放问题。

## 可复用到的选题

- **「R-CNN 家族的 2 年 3 代——工程突围的教科书」**——以 R-CNN 2014 → Fast R-CNN 2015 → Faster R-CNN 2016 为时间线，讲深度学习时代"把学术算法做成产品"最清晰的案例。每代消除一个 bottleneck，适合产品工程和技术栈迭代类文章。
- **「Ross Girshick 的 3 年——一个人推动一个任务家族」**——从 2014 R-CNN 到 2017 Mask R-CNN，Girshick 几乎独力推动了 object detection 整条路线。加上 Kaiming He 在 FAIR 2016-2020 的贡献，这是研究者个人 shape 子领域的最近案例。
- **「benchmark 推动算法——没有 COCO 就没有现代 detector」**——COCO 的 80 类 + 150 万 mask 标注推动了 2016-2020 年 detection 的整个演化。benchmark 作为 research driver 的案例（ImageNet、COCO、GLUE、MMLU）值得独立讨论。
