# 合作演化的五块积木——1981 年被一场计算机锦标赛拼成了定理

> 种子：The Evolution of Cooperation (Axelrod & Hamilton, 1981, cited 20185)
> 方向：refs
> 谱系长度：6 篇（1 种子 + 5 前驱）

## 脉络一句话

合作为什么能在"人人自利"的世界里演化出来——这个问题从 Darwin 时代挂到 1980 年，Fisher、Hamilton、Trivers、Maynard Smith、Dawkins 各造了一块理论积木（适应度、亲选择、互惠利他、ESS、基因视角），直到 Axelrod 用一场计算机 Prisoner's Dilemma 锦标赛让这五块同时落位，把"合作能从零起步"从哲学口号变成了 tit-for-tat 这三个可验证字。

## 种子

**The Evolution of Cooperation** (Axelrod & Hamilton, 1981) — 20185 引用
Axelrod 把"合作为什么存在"这个 Darwin 以来的老问题搬进了计算机：他把 Prisoner's Dilemma 做成一个循环博弈锦标赛，让世界各地的学者提交策略互相厮杀。获胜策略 tit-for-tat 只有两条规则——首轮合作，之后完全复制对手上一轮的动作。论文证明了三件事：合作能在非社会世界里 **get started**，能在各种策略中 **thrive**，一旦建立能 **resist invasion**。Hamilton 的亲选择补上了亲属间的合作，reciprocity 补上了陌生人之间的合作——这个 1981 年的组合首次提供了生物—经济—社会行为的统一解释。
DOI: 10.1126/science.7466396 | AAAS closed

## 前驱 / 相关

### The Genetical Theory of Natural Selection (Fisher, 1930) — 17766 引用
Fisher 把达尔文的选择压力写成了统计方程：自然选择的速率等于种群中的加性遗传方差。这是"适应度"第一次被严格定义成一个数量。Axelrod-Hamilton 1981 计算"哪种策略会扩散"时，背后的量化语言（策略 X 比策略 Y 有更高 expected payoff → X 的频率会增加）完全继承自 Fisher 的框架。没有 Fisher，策略比较只能停在类比层。

### The Genetical Evolution of Social Behaviour I (Hamilton, 1964) — 15824 引用
Hamilton 提出 **inclusive fitness**：一个基因能传播不只靠宿主本身繁殖，也靠帮助携带同基因的亲属繁殖。这解开了工蜂之谜——它为什么愿意为姐妹送死。**r × b > c**（亲缘系数 × 受惠者收益 > 自身成本）就是著名的 Hamilton's rule。Axelrod-Hamilton 1981 里 Hamilton 是共同作者，他把自己 17 年前的亲选择结论嵌进了 Axelrod 的博弈框架——论文的第一块拼图就是"亲属合作"这一维已被证明，剩下要证的是"陌生人合作"。

### The Evolution of Reciprocal Altruism (Trivers, 1971) — 10991 引用
Trivers 回答了 Hamilton 没解释的另一半：为什么素不相识的个体也合作？他提出 **reciprocal altruism**——"你现在帮我，以后我帮你"的演化逻辑。Trivers 列出了三个案例（鱼的清洁共生、鸟类示警、人类互惠），但没给博弈论证明——概念是对的，机制还是直觉。Axelrod-Hamilton 1981 做的正是 Trivers 概念的**形式化与实证**：在 Prisoner's Dilemma 这个最简博弈里，只要相遇概率够高，reciprocal 就能演化。Trivers 搭台，Axelrod 证明。

### The Logic of Animal Conflict (Maynard Smith & Price, 1973) — 6170 引用
这篇论文只有 4 页 Nature，但开创了 **Evolutionarily Stable Strategy (ESS)**：一个策略如果能在被任何小比例突变入侵时都保住自己，就是演化稳定的。他们用"鹰鸽博弈"（打架派 vs 退让派）第一次把博弈论搬进了演化生物学。Axelrod-Hamilton 1981 的核心结论"tit-for-tat 在 high enough w 下是 ESS" 就是直接套用这个框架。没有 Maynard Smith-Price，Axelrod 拿不到合作能否抵抗入侵的判据。

### The Selfish Gene (Dawkins, 1976) — 10523 引用
Dawkins 把 Hamilton + Trivers 的工作打包成了"基因视角"哲学：演化的单位不是个体不是物种，而是基因。看似无私的合作行为，从基因视角看是它自己在找副本传播。这给了 Axelrod-Hamilton 1981 一个关键的叙事许可——他们可以不去纠结"个体为什么选择合作"，直接写"哪个策略的出现频率会增加"。哲学框架从 Dawkins 来，技术结论回给 Dawkins 背书。

## 一条主线

1962 年前后，生物学里的"群选择论"（利他是为了物种好）被 George C. Williams 打散，合作演化变成了一个理论黑洞：个体选择的框架下，合作个体应该被占便宜方淘汰。

1964 年 Hamilton 先补上了**亲属**这一角——只要你帮的是分享基因的亲戚，基因层面就有理由。1971 年 Trivers 再补上**陌生人**——只要相遇概率够高，"我欠你人情"能从博弈均衡里长出来，但 Trivers 只有概念没有证明。1973 年 Maynard Smith-Price 给了博弈论的**稳定性工具**（ESS）。1976 年 Dawkins 把这一切翻译成**基因视角**的流行叙事。

前面这四件事都是 1960-1976 十六年里完成的——全部的理论零件齐了。1981 年 Axelrod 和 Hamilton 做了最后一步：搞个比赛，让各种策略真的打一架，看谁稳定。tit-for-tat 夺冠，论文证明它是 ESS。这是合作演化领域从"概念阶段"跨到"定理阶段"的那一刻——也是**计算机模拟第一次被当作社会科学的正当证据**。

## 未解

- Axelrod 的模型建立在"重复博弈 + 相遇概率 w 足够大"这个前提上。现实世界中大多数相遇是一次性的，tit-for-tat 不成立——这个问题 Robert Sugden、Ken Binmore 等人持续到 2010 年代都在修补（间接互惠、声誉机制）。
- tit-for-tat 在有噪声的环境中会陷入 "报复螺旋"（一次误解导致永久背叛）。后续 GTFT、Pavlov 等策略都是来修这个 bug 的。Axelrod 1981 漂亮但脆弱。
- 从博弈论到真实人类行为之间的断裂一直没闭合：行为经济学（Fehr、Gächter）2000 年代发现人类常用"强互惠"（哪怕自己吃亏也要惩罚背叛者），这不是任何 Axelrod 框架下的 ESS。

## 可复用到的选题

- **「当博弈论第一次成为社会科学的证据」**——以 Axelrod 1981 为切片，讲计算机模拟从工程方法晋升为学术证据的关键一跃。适合做"方法论改朝换代"类文章。
- **「合作是一种被证明的现象，不是美德」**——用这条谱系反转公众语境下合作=道德品质的叙事，讲清楚合作其实是一种在特定条件下稳定的演化结果。
