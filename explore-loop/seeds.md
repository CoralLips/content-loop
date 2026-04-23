# explore-loop 种子登记

> 种子池。Claude 在 SKILL 步骤 1 读这个表，按 `prov` 升序 + 同深度 `引用` 降序取第一个 ⬜。

## 状态说明

- ⬜ 待处理 — 还没跑过
- ✅ 已成谱 — 谱系文件已生成，见 `lineages/`
- ❄️ cold — refs 和 cites 都空，暂不重试
- ⚠️ 404 — OpenAlex 未收录，跳过

## 列说明

- **ID**：arxiv ID（`YYMM.NNNNN`）或 DOI（`10.xxxx/yyyy`）或 OpenAlex ID（`W数字`）
- **引用**：OpenAlex 查出的引用数；`-` 表示首次跑时才查
- **prov**：provenance 跳数。`0` = arxiv-loop 直接产出；`N` = 来自某条 lineage 的候选回流
- **来源**：`arxiv:score-XX` 或 `lineage-NNN` 或 `manual`
- **主题**：人类可读的一句话标签

## 种子池

| 状态 | ID | 引用 | prov | 来源 | 主题 |
|------|----|------|------|------|------|
| ⚠️ | 2201.11903 | - | 0 | manual | Chain-of-Thought 原论文（OpenAlex 元数据毒化） |
| ❄️ | 2210.03629 | - | 0 | manual | ReAct 原论文（refs 空） |
| ✅ | 1706.03762 | 6525 | 0 | manual | Attention Is All You Need → lineage-001 |
| ⚠️ | 1810.04805 | - | 0 | manual | BERT（OpenAlex 404） |
| ✅ | 2005.14165 | 3029 | 0 | manual | GPT-3 → lineage-002 |
| ❄️ | 2212.08073 | - | 0 | manual | Constitutional AI（refs 空） |
| ✅ | 10.1126/science.7466396 | 20185 | 0 | manual | Axelrod Cooperation (1981) → lineage-003 |
| ✅ | 10.1016/0010-0285(80)90005-5 | 12324 | 0 | manual | Treisman Binding (1980) → lineage-004 |
| ❄️ | 2604.11373 | - | 0 | arxiv:score-20 | 机器人只需要"摸一摸"就能学会数数（refs 空） |
| ❄️ | 2604.10511 | - | 0 | arxiv:score-20 | AI 的"慢思考"只是"慢说话"（refs 空） |
| ❄️ | 2604.10288 | - | 0 | arxiv:score-20 | "死认知"：AI 偷偷做了你的思考（refs 空） |
| ❄️ | 2604.09911 | - | 0 | arxiv:score-20 | AI 的"一般智力"正在下降（AGI G 因子，refs 空） |
| ❄️ | 2604.09780 | - | 0 | arxiv:score-20 | MoE 的"专家特化"是神话（refs 空） |
| ❄️ | 2604.11120 | - | 0 | arxiv:score-19 | "好人"人格的 AI 反而最容易被操纵（refs 空） |
| ❄️ | 2604.11828 | - | 0 | arxiv:score-21(unpub) | 科学，可能走进了一条死胡同（refs 空） |
| ❄️ | 2604.10957 | - | 0 | arxiv:score-21(unpub) | 文字演变有"分子钟"——帝国改写文字的破坏力第一次被量化了（refs 空） |
| ❄️ | 2604.15267 | - | 0 | arxiv:score-19(unpub) | 越会推理的 AI 越不合作（refs 空） |
| ✅ | 10.1109/cvpr.2016.90 | 218108 | 1 | lineage-001 | Deep Residual Learning for Image Recognition → lineage-005 |
| ✅ | 10.18653/v1/d15-1166 | 8543 | 1 | lineage-001 | Effective Approaches to Attention-based NMT → lineage-011 |
| ⚠️ | 1609.08144 | 5653 | 1 | lineage-001 | Google NMT（OpenAlex refs 仅 4 条，元数据稀疏不足成谱） |
| ✅ | 10.4230/lipics.fun.2016.3 | 3096 | 1 | lineage-001 | Generating Sequences With RNN (Graves 2013) → lineage-015 |
| ✅ | 1705.03122 | 1904 | 1 | lineage-001 | Convolutional Seq2Seq Learning (Gehring 2017) → lineage-016 |
| ⚠️ | 10.4230/lipics.cp.2025.31 | 17244 | 1 | lineage-002 | RoBERTa（OpenAlex 元数据三合一毒化） |
| ✅ | 1503.02531 | 13913 | 1 | lineage-002 | Distilling the Knowledge in a Neural Network → lineage-006 |
| ✅ | 10.1023/a:1007379606734 | 6201 | 1 | lineage-002 | Multitask Learning (Caruana 1997) → lineage-013 |
| ✅ | 10.5962/bhl.title.27468 | 17766 | 1 | lineage-003 | The Genetical Theory of Natural Selection → lineage-007 |
| ✅ | 10.1016/0022-5193(64)90038-4 | 15824 | 1 | lineage-003 | The Genetical Evolution of Social Behaviour I → lineage-008 |
| ✅ | 10.1086/406755 | 10991 | 1 | lineage-003 | The Evolution of Reciprocal Altruism → lineage-009 |
| ✅ | W2624262714 | 10523 | 1 | lineage-003 | The Selfish Gene → lineage-010 |
| ✅ | 10.1038/246015a0 | 6170 | 1 | lineage-003 | The Logic of Animal Conflict → lineage-014 |
| ✅ | 10.1037/0033-295x.84.2.127 | 7111 | 1 | lineage-004 | Controlled and Automatic Human Information Processing II → lineage-012 |
| ❄️ | W2322677917 | 2510 | 1 | lineage-004 | Cognition and Reality (Neisser 1976, refs 空) |
| ❄️ | W1708089250 | 2444 | 1 | lineage-004 | Chronometric Explorations (Posner 1978, refs 空) |
| ❄️ | 10.2307/1421985 | 2153 | 1 | lineage-004 | Processing of Information and Structure (Garner 1974, refs 空) |
| ✅ | 10.1162/neco.1997.9.8.1735 | 95830 | 2 | lineage-005 | Long Short-Term Memory → lineage-017 |
| ✅ | 10.1145/3065386 | 75671 | 2 | lineage-005 | AlexNet (Krizhevsky-Sutskever-Hinton 2012) → lineage-018 |
| ✅ | 1409.1556 | 75502 | 2 | lineage-005 | VGG (Simonyan-Zisserman 2014) → lineage-019 |
| ✅ | 10.1109/tpami.2016.2577031 | 53230 | 2 | lineage-005 | Faster R-CNN (Ren-He-Girshick-Sun 2016) → lineage-020 |
| ⬜ | 10.1109/cvpr.2015.7298594 | 46494 | 2 | lineage-005 | Going Deeper with Convolutions (GoogLeNet) |
| ⬜ | 10.1007/978-3-319-10602-1_48 | 41459 | 2 | lineage-005 | Microsoft COCO |
| ⬜ | 10.1007/s11263-015-0816-y | 39819 | 2 | lineage-005 | ImageNet Large Scale Visual Recognition Challenge |
| ⬜ | 10.1109/cvpr.2015.7298965 | 36528 | 2 | lineage-005 | Fully Convolutional Networks for Segment... |
| ⬜ | W2095705004 | 34245 | 2 | lineage-006 | Dropout (Srivastava et al. 2014 JMLR) |
| ⬜ | 10.1109/msp.2012.2205597 | 10244 | 2 | lineage-006 | Deep Neural Networks for Acoustic Modeling |
| ⬜ | 10.1007/3-540-45014-9_1 | 7717 | 2 | lineage-006 | Ensemble Methods in Machine Learning |
| ⬜ | 1207.0580 | 6646 | 2 | lineage-006 | Preventing Co-adaptation of Feature Detectors (Dropout preprint) |
| ⬜ | 10.1162/neco.1991.3.1.79 | 4830 | 2 | lineage-006 | Adaptive Mixtures of Local Experts (MoE) |
| ⬜ | W2168231600 | 2913 | 2 | lineage-006 | Large Scale Distributed Deep Networks (DistBelief) |
| ⬜ | 10.1145/1150402.1150464 | 2063 | 2 | lineage-006 | Model Compression (Buciluǎ-Caruana 2006) |
| ⬜ | 10.5962/bhl.title.121292 | 1441 | 2 | lineage-007 | The Descent of Man (Darwin 1871) |
| ⬜ | 10.5962/bhl.title.87899 | 1002 | 2 | lineage-007 | Variation of Animals and Plants (Darwin 1868) |
| ⬜ | 10.1017/cbo9780511702884 | 670 | 2 | lineage-007 | The Life and Letters of Charles Darwin |
| ⬜ | 10.5962/bhl.title.61004 | 554 | 2 | lineage-007 | Versuche über Pflanzen-Hybriden (Mendel 1866) |
| ⬜ | 10.1111/j.1474-919x.1962.tb08690.x | 2073 | 2 | lineage-008 | Animal Dispersion in Relation to Social Behaviour (Wynne-Edwards 1962) |
| ⬜ | 10.2307/2283297 | 647 | 2 | lineage-008 | The Statistical Processes of Evolutionary Theory (Moran) |
| ⬜ | 10.2307/2092623 | 11710 | 2 | lineage-009 | The Norm of Reciprocity (Gouldner 1960) |
| ⬜ | 10.1515/9781400820108 | 3934 | 2 | lineage-009 | Adaptation and Natural Selection (Williams 1966) |
| ⬜ | 10.1201/b18653-3 | 3670 | 2 | lineage-009 | Games and Decisions (Luce & Raiffa 1957) |
| ⬜ | W2304361434 | 2660 | 2 | lineage-009 | The Civic Culture (Almond & Verba 1963) |
| ⬜ | W1997302797 | 2337 | 2 | lineage-009 | Social Learning and Personality Development (Bandura 1963) |
| ⬜ | 10.1007/978-1-4684-7862-4_22 | 8014 | 2 | lineage-010 | Evolution and the Theory of Games (Maynard Smith book) |
| ⬜ | 10.2307/2576242 | 6323 | 2 | lineage-010 | Sociobiology: The New Synthesis (Wilson 1975) |
| ⬜ | 10.1016/0022-5193(75)90111-3 | 5294 | 2 | lineage-010 | Mate Selection: Handicap Principle (Zahavi 1975) |
| ⬜ | 10.1146/annurev.es.05.110174.001545 | 3864 | 2 | lineage-010 | The Evolution of Social Behavior (Alexander 1974) |
| ⬜ | 10.1016/0022-5193(71)90189-5 | 3449 | 2 | lineage-010 | Geometry for the Selfish Herd (Hamilton 1971) |
| ⬜ | 10.1016/0022-5193(74)90110-6 | 2445 | 2 | lineage-010 | Theory of Games and Evolution of Animal Conflicts (Maynard Smith 1974) |
| ⬜ | W2118434577 | 24073 | 2 | lineage-011 | Learning Phrase Representations using RNN Encoder-Decoder (Cho 2014) |
| ⬜ | 10.3115/1073083.1073135 | 21196 | 2 | lineage-011 | BLEU (Papineni 2001) |
| ⬜ | 1409.0473 | 14596 | 2 | lineage-011 | Neural Machine Translation by Jointly Learning to Align and Translate (Bahdanau 2014) |
| ⬜ | 1409.3215 | 13334 | 2 | lineage-011 | Sequence to Sequence Learning with Neural Networks (Sutskever 2014) |
| ⬜ | 1502.03044 | 7512 | 2 | lineage-011 | Show, Attend and Tell (Xu 2015) |
| ⬜ | 10.3115/1073445.1073462 | 3276 | 2 | lineage-011 | Statistical Phrase-Based Translation (Koehn 2003) |
| ⬜ | 1409.2329 | 2280 | 2 | lineage-011 | Recurrent Neural Network Regularization (Zaremba 2014) |
| ⬜ | W2951527505 | 2276 | 2 | lineage-011 | Recurrent Models of Visual Attention (Mnih 2014) |
| ⬜ | 10.1037/h0054651 | 18222 | 2 | lineage-012 | Studies of Interference in Serial Verbal Reactions (Stroop 1935) |
| ⬜ | 10.1016/s0022-5371(72)80001-x | 9490 | 2 | lineage-012 | Levels of Processing: A Framework for Memory Research |
| ⬜ | 10.3758/bf03203267 | 7266 | 2 | lineage-012 | Effects of Noise Letters upon Identification (Eriksen 1974) |
| ⬜ | 10.2307/1421603 | 7047 | 2 | lineage-012 | Attention and Effort (Kahneman 1973) |
| ⬜ | 10.1016/s0079-7421(08)60422-3 | 6961 | 2 | lineage-012 | Human Memory: A Proposed System (Atkinson & Shiffrin 1968) |
| ⬜ | 10.1037/0033-295x.84.1.1 | 5725 | 2 | lineage-012 | Controlled and Automatic Human Information Processing I (Schneider-Shiffrin 1977) |
| ⬜ | 10.4324/9781315506173-8 | 4736 | 2 | lineage-012 | Perception and Communication (Broadbent 1958) |
| ⬜ | 10.1038/323533a0 | 30281 | 2 | lineage-013 | Learning Representations by Back-Propagating Errors (Rumelhart-Hinton-Williams 1986) |
| ⬜ | W2125055259 | 23694 | 2 | lineage-013 | C4.5: Programs for Machine Learning (Quinlan 1992) |
| ⬜ | 10.2307/2289883 | 17511 | 2 | lineage-013 | Statistical Analysis with Missing Data (Little-Rubin 1989) |
| ⬜ | 10.1023/a:1022643204877 | 14650 | 2 | lineage-013 | Induction of Decision Trees (Quinlan 1986) |
| ⬜ | 10.1162/neco.1989.1.4.541 | 11762 | 2 | lineage-013 | Backprop Applied to Handwritten Zip Code Recognition (LeCun 1989) |
| ⬜ | 10.1007/978-1-4612-2748-9 | 4714 | 2 | lineage-013 | Causation, Prediction, and Search (Spirtes-Glymour-Scheines 1993) |
| ⬜ | 10.1126/science.156.3774.477 | 3684 | 2 | lineage-014 | Extraordinary Sex Ratios (Hamilton 1967) |
| ⬜ | 10.1038/2011145a0 | 2034 | 2 | lineage-014 | Group Selection and Kin Selection (Maynard Smith 1964) |
| ⬜ | 10.1111/j.1469-1809.1957.tb01874.x | 903 | 2 | lineage-014 | Extension of Covariance Selection Mathematics (Price 1972) |
| ⬜ | 10.1109/icassp.2013.6638947 | 8784 | 2 | lineage-015 | Speech Recognition with Deep RNN (Graves-Mohamed-Hinton 2013) |
| ⬜ | 10.1109/72.279181 | 8343 | 2 | lineage-015 | Learning Long-Term Dependencies with Gradient Descent Is Difficult (Bengio 1994) |
| ⬜ | 10.21236/ada273556 | 7516 | 2 | lineage-015 | Penn Treebank (Marcus 1993) |
| ⬜ | 10.1016/j.neunet.2005.06.042 | 5351 | 2 | lineage-015 | Framewise Phoneme Classification with BLSTM (Graves-Schmidhuber 2005) |
| ⬜ | 10.57702/o9raffed | 15691 | 2 | lineage-016 | Batch Normalization (Ioffe-Szegedy 2015) |
| ⬜ | 10.1207/s15516709cog1402_1 | 10728 | 2 | lineage-016 | Finding Structure in Time (Elman 1990) |
| ⬜ | 10.1016/0893-6080(88)90007-x | 959 | 3 | lineage-017 | Generalization of Backprop Recurrent Gas Market Model (Werbos 1988) |
| ⬜ | 10.1103/physrevlett.59.2229 | 952 | 3 | lineage-017 | Generalization of Back-Propagation to RNN (Pineda 1987) |
| ⬜ | W1556094700 | 750 | 3 | lineage-017 | LSTM Can Solve Hard Long Time Lag Problems (NIPS 1996) |
| ⬜ | 10.1109/cvpr.2009.5206848 | 60864 | 3 | lineage-018 | ImageNet: A Large-Scale Hierarchical Image Database (Deng-Fei-Fei 2009) |
| ⬜ | 10.57702/zp44cu3g | 25469 | 3 | lineage-018 | Learning Multiple Layers of Features from Tiny Images (CIFAR, Krizhevsky 2009) |
| ⬜ | W1662382123 | 13237 | 3 | lineage-018 | Rectified Linear Units Improve RBM (Nair-Hinton 2010) |
| ⬜ | W1504993593 | 3635 | 3 | lineage-018 | Handwritten Digit Recognition with Backprop Network (LeCun 1989 NIPS) |
| ⬜ | 10.1109/cvpr.2014.81 | 31455 | 3 | lineage-019 | R-CNN: Rich Feature Hierarchies (Girshick 2014) |
| ⬜ | 10.1007/s11263-014-0733-5 | 7224 | 3 | lineage-019 | Pascal VOC Challenge Retrospective (Everingham 2014) |
| ⬜ | 1312.6034 | 4915 | 3 | lineage-019 | Deep Inside Convolutional Networks: Visualising + Saliency Maps (Simonyan 2013) |
| ⬜ | 10.1109/cvpr.2015.7298965 | 36528 | 3 | lineage-020 | Fully Convolutional Networks for Segmentation (Long-Shelhamer-Darrell 2015) |






## 自动维护机制

两条续燃通道：

**A. 横向注入**（arxiv-loop → seeds）
- `bin/harvest-seeds.mjs` 每次 SKILL 启动时跑
- 扫 `arxiv-loop/queue/INDEX.md` 里「已通过评估」区块，`评分 >= 19` 的行
- 读对应 queue 文件，正则抽 arxiv ID
- 不在本表内 → 追加，状态 ⬜，prov=0，来源 `arxiv:score-NN`

**B. 纵向回流**（lineage 候选 → seeds）
- `bin/reflux.mjs` 每次合成完 lineage 后跑
- 本次候选里 `引用 > 500` 且 prov + 1 <= 5 且不在本表的
- → 追加，状态 ⬜，prov = 当前 seed prov + 1，来源 `lineage-NNN`

## 手动补种

用户也可以直接编辑本表追加行，`prov` 填 `0`，`来源` 填 `manual`。
