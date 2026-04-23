# Transformer 的血脉：attention 如何一步步替掉 recurrence

> 种子：Attention Is All You Need (2017, cited 6525)
> 方向：refs
> 谱系长度：5 篇前驱

## 脉络一句话

Transformer 不是革命，是 2013-2017 四年四步把 RNN 逐渐替换掉的终点——attention 一开始只是给 RNN 打补丁，最后成为主角。

## 种子

**Attention Is All You Need** (Vaswani 等, 2017) — 6525 引用
完全抛弃 RNN/CNN，仅靠自注意力 + 位置编码完成序列建模。提出 Scaled dot-product attention、多头注意力、sinusoidal 位置编码等至今仍在用的组件。
原文：https://arxiv.org/abs/1706.03762

## 前驱

### Generating Sequences With Recurrent Neural Networks (Graves, 2013) — 3096 引用
"被替换掉的东西"的代表作。Graves 证明 RNN + LSTM 能稳定生成长序列文本/音频。这是 Transformer 在论文里**直接对标**的基线：必须在 RNN 擅长的序列任务上超过它才能立住。

### Effective Approaches to Attention-based Neural Machine Translation (Luong, 2015) — 8541 引用
把 attention 做成了可复用的模块化组件（global vs local attention）。Transformer attention 的**直系父亲**——保留了"attention 作为对齐工具"的思路，但把它从 RNN 的辅助提到主角位置。

### Google's Neural Machine Translation System (Wu 等, 2016) — 5653 引用
把 encoder-decoder + attention 推到产业级规模（GNMT），证明 attention-based NMT 工程可行。Transformer 论文的 BLEU 基线数字就是跟它比的。

### Deep Residual Learning for Image Recognition (He 等, 2016) — 218070 引用
谱系里引用量最高但**不是 attention 的直系前驱**——它是工程预设。残差连接 + LayerNorm 让 6+ 层 self-attention 的深堆叠可训练。没有它，Transformer 训不起来。

### Convolutional Sequence to Sequence Learning (Gehring 等, 2017) — 1904 引用
Transformer 的**同期对手**。ConvS2S 也试图去掉 RNN，走的是"卷积 + attention"路线。半年后 Transformer 证明卷积这步多余——attention + FFN + residual 就够了。

## 一条主线

```
2013 Graves          RNN 能做序列生成
       ↓  补丁化
2015 Luong           给 RNN 加 attention，解决长距离依赖
       ↓  规模化
2016 GNMT            attention-based NMT 工业级可用
       ↓  去递归尝试
2017 ConvS2S         卷积 + attention，去掉 RNN（中间形态）
       ↓  去卷积
2017 Transformer     attention + FFN，全干净
```

每一步只多走一点，看起来像"革命"的 Transformer 其实是进化的终点。工程维度上，ResNet 的残差连接是这整条进化的硬件先决条件。

## 未解

- **ConvS2S 为什么消失了**？反事实：如果 Gehring 先把卷积去掉，历史会不会记住 ConvS2S？
- **多头注意力的"多头"到底是冗余还是专家**？MoE 专家特化的研究表明"特化"多半是假象，attention heads 可能同样。
- **attention 是否真的优越于卷积**？Performer/Linformer 线研究倾向于"FFN 才是主体，attention 可替换"——挑战了 Transformer 的标准叙事。

## 可复用到的选题

- 「Transformer 不是革命，是四年四步的进化」——公众号拆解
- 「ConvS2S 的消失：同期方案为什么被完全盖过」——反事实历史
- 「残差连接是 Transformer 的隐藏父亲」——工程史视角
