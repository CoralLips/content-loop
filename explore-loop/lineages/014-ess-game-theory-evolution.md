# 从 Hamilton 1964 到 ESS——进化博弈论的 9 年孕育

> 种子：The Logic of Animal Conflict (Maynard Smith & Price, 1973, cited 6170)
> 方向：refs
> 谱系长度：5 篇（1 种子 + 4 前驱）

## 脉络一句话

1960s 末的行为生态学有一个困境：**动物冲突为什么常常不打到死伤**？群体选择派（Wynne-Edwards 1962）说"为种群好"，Hamilton 1964 已经用亲缘选择否决了这种答案。Maynard Smith 1964 紧接 Hamilton 做了 Group vs Kin 的二选一裁判，但动物非亲属之间的克制仍然无解。Hamilton 自己 1967 的"奇异性比"论文里已经把博弈论思路引进生物学——"非输赢对称时最优策略不再是 50:50"。George Price 1972 独立发展了 covariance selection 数学并写了一篇没发表的动物冲突博弈手稿交给 Maynard Smith。M-S 1973 把这些零件合成：**Evolutionarily Stable Strategy（ESS）——如果一个策略一旦被种群采纳就无法被任何突变体入侵，它就是进化稳定的**。Hawk-Dove game 从此成为行为生态学的基本语言。

## 种子

**The Logic of Animal Conflict** (John Maynard Smith & George R. Price, 1973) — 6170 引用
发表于 *Nature* 的一页短文（准确说是 5 页），可能是 20 世纪生物学最密集的 5 页之一。论文构造了一个简单的二选一博弈：动物遇到竞争者时可以"鹰"（Hawk，全力攻击，赢者获益，败者重伤）或"鸽"（Dove，威慑姿态，两鸽相遇均分，鸽遇鹰则逃）。用支付矩阵和种群遗传学的复制方程分析，他们证明**在现实参数下既不全鹰也不全鸽才是稳定**——种群会演化到一个鹰鸽混合比例，此比例对应 ESS。更深的贡献是 ESS 这个**概念本身**：进化稳定性 = 抗入侵性，这把"适应度最大化"从个体优化问题转成了**种群博弈的均衡问题**。从此行为生态学有了自己的博弈论语言，不必再借用经济学的 Nash 均衡（二者有细微但重要的差别：ESS 要求 strict 入侵劣势，不只是最优反应）。
DOI: 10.1038/246015a0 | Nature closed

## 前驱 / 相关

### Extraordinary Sex Ratios (Hamilton, 1967) — 3684 引用
Hamilton 在 Science 上的这篇论文其实已经有了博弈论的全部骨架。问题是：**为什么大多数物种的性比是 1:1，但某些寄生蜂和螨虫里雌性压倒性多数**？经典 Fisher 1930 的 argument 是性比 1:1 是种群均衡（罕见性别的个体有边际优势）。Hamilton 指出 Fisher 的假设（随机交配）在某些局部交配系统里不成立——如果一只母体的后代只在同窝内交配，最优策略就是尽量多生女儿只生一两只儿子。**Hamilton 用 "unbeatable strategy"（无敌策略）这个术语，差点就直接发明了 ESS**。Maynard Smith 后来承认 Hamilton 1967 是 ESS 概念的真正源头，但 Hamilton 没把它命名、没推广到一般博弈。Hamilton 自己专注于亲缘选择的延伸（kin selection + 性比），错过了"把博弈论作为通用工具"的这个飞跃。这是**科学史上"差一步"的经典案例**——Hamilton 拿着所有零件但没有组装的野心，Maynard Smith 有组装野心但需要 George Price 的数学工具才能收尾。

### Group Selection and Kin Selection (Maynard Smith, 1964) — 2034 引用
Hamilton 1964 在 2 月投稿、9 月发表，Maynard Smith 同年在 *Nature* 上发了一篇短文当裁判。他明确区分了两个概念：**kin selection**（亲缘选择，Maynard Smith 发明的术语本身来自这篇论文）和 **group selection**（群体选择，Wynne-Edwards 1962 立场）。Maynard Smith 用一个简单 haystack model（谷堆模型）讨论群体选择的可能性——只有当群体间的迁移率极低、群体内的利他成本很小时，群体选择才能超过个体选择的反作用。在生物现实里这几乎不成立。**"kin selection"这个术语从此正式化**，Hamilton 1964 的 r·b>c 规则也有了简洁的标签。Maynard Smith 在这篇里展现了他**用最简模型做关键判断**的风格——9 年后他用同样风格在 Hawk-Dove game 里做 ESS 判断。这种"minimal math, maximum insight"的方法论是英国演化生物学 1960s-80s 的主流。

### Extension of Covariance Selection Mathematics (George R. Price, 1972) — 903 引用
George Price 是一位悲剧性的天才——化学博士出身，独立研究者，没有学术职位，自学遗传学数学，先后在纽约和伦敦工作。1967 年他独自重新推导了 Hamilton 的 r·b>c 公式，并得出了一个更一般的协方差形式——**Price equation（普莱斯方程）**：任何性状变化率可以分解为"within-group covariance + between-group transmission"。这个方程是**选择理论的万能公式**，从 kin selection 到 group selection 到 cultural evolution 都能用它推出来。1970 年他投给 *Nature* 被 William Hamilton 审稿，Hamilton 读完震惊（"我需要几天来消化这个"），破格推荐发表。1972 年这篇"Extension"论文在 *Annals of Human Genetics* 上把 covariance selection 扩展到多 locus 情况。Price 和 Maynard Smith 的合作开始于 1971—Price 把自己未发表的动物冲突博弈手稿（含 ESS 雏形）给了 M-S，两人合作出 1973 年论文。**1975 年 Price 皈依基督教、变卖家产施舍穷人、身无分文在伦敦一个空置建筑里自杀**。这篇短文的另一作者，是生物学史上最悲剧也最谦卑的天才之一。

### Animal Dispersion in Relation to Social Behaviour (Wynne-Edwards, 1962) — 2073 引用
Wynne-Edwards 这本 653 页的巨著主张**动物行为的很多特征都是为了控制种群规模以避免资源耗竭**——鸟类的领域性、鱼群的数量显示行为、海豹的繁殖群体大小，都是"为群体好"的结果。这是**群体选择论的高峰**。Wynne-Edwards 的书在 1960s 前半段被广泛接受——它符合生态学家的直觉（过度繁殖会耗尽资源），符合 Konrad Lorenz 的动物行为叙事（动物"懂得"自我约束）。Hamilton 1964 和 Maynard Smith 1964 是两颗炸弹——前者建立了亲缘选择的替代框架，后者明确指出群体选择的数学困难。到 1973 年 Hawk-Dove game 出现时，Wynne-Edwards 的立场已经被放弃了大半——**ESS 是用博弈论给群体选择的棺材钉上最后一枚钉子**：动物之间的"克制"不是为了群体好，而是自私个体在不确定支付下的稳定策略。Wynne-Edwards 1962 在本 lineage 里是**理论靶子**，不是直接贡献者——但没有这个靶子，ESS 的贡献就不突出。

## 一条主线

1962-1973 年这 11 年是**行为生态学的奠基期**。Wynne-Edwards 1962 是旧范式的顶峰，三个年轻人（Hamilton、Maynard Smith、Price）合力把它推倒。这个故事的主线有两条交织的技术线和一条人物线。

**技术线 1：亲缘选择数学的成熟**。Hamilton 1964 的 r·b>c 最初以全累赘的 exact computation 方式写成——58 页公式，读者极少。Price 1970/1972 把它提炼成协方差方程，让任何遗传变化都能用同一框架分析。这条线到 1974-1975 年被 Maynard Smith（用 Price equation 推导 ESS 的稳定性条件）和 Oster-Wilson（蚂蚁行为生态学）扩展。

**技术线 2：博弈论进入生物学**。博弈论 1944 年由 von Neumann-Morgenstern 提出用在经济学，Luce-Raiffa 1957 教科书普及。Hamilton 1967 是第一次把它用于演化问题（性比）。Maynard Smith 1972 的一次会议报告（"Game theory and the evolution of fighting"）第一次完整提 ESS 概念，1973 年在 *Nature* 短文里命名。**关键点是：经济博弈论的 Nash 均衡是"理性个体"的产物，ESS 是"无理性选择、只有遗传复制"的产物——两个数学形式高度相似但解释完全不同**。Maynard Smith 的洞察是博弈论不需要理性，只需要"繁殖率差异"。

**人物线：三人的不对称合作**。Hamilton 是天才但孤僻——1964 的论文在 LSE 博士阶段几乎被导师 Haldane 劝放弃，答辩被质疑（"这是生物学还是数学"）。Price 是外部闯入者——化学背景，30 岁才转生物，自费研究。Maynard Smith 是这三人中**唯一的 establishment figure**——UCL 教授，有学术平台，出色的综合者。他的角色不是开创者而是**合成者**——把 Hamilton 的亲缘选择、Price 的协方差数学、博弈论三样工具捏在一起，放进一个可传播的 package（Hawk-Dove + ESS）。1975 年他写了 *Evolution and the Theory of Games* 这本书，这是 ESS 正式进入生态学教科书的节点。

所以 Maynard Smith-Price 1973 的思想史位置是**亲缘选择革命的终章 + 进化博弈论的首章**。它既闭合了 Hamilton 1964 开启的"利他行为如何可能"的问题（答案：ESS 内生稳定性），又开启了 1980s-90s 的"合作演化"研究（Axelrod-Hamilton 1981 的 tit-for-tat、Nowak-May 1992 的空间博弈、Hauert 等人的 public goods game）。从学科史看，**这篇 5 页论文的产出/影响比是 20 世纪生物学最高的几篇之一**。

## 未解

- ESS 假定支付矩阵是**固定**的，但现实中鹰鸽支付随种群密度、季节、资源波动而变——**动态 ESS** 的理论（1980s Maynard Smith-Parker 延伸）至今有争议，实验验证很少。
- ESS 原始版本是**单步一次决策**，真实动物会多轮重复相遇——**iterated games and reputation dynamics**（Axelrod 1984 之后）把 ESS 扩展到 TFT 族策略，但**最优的重复博弈策略空间**至今没完整分类。
- **ESS vs Nash**：二者形式相同但 ESS 更严格（要求 strict invasion resistance）。这个数学差异在 2000s **evolutionary game theory vs economic game theory** 的学科对话里引出很多论战，至今没完整统一。
- Price 方程是否真的**统一了所有选择理论**？近年 Kerr-Godfrey-Smith 等人提出它只是**会计工具**而非因果机制——把群体间方差重新命名为"group selection"并不等于承认群体选择的因果力。这个"Price equation 到底是什么"的争论 2007-2015 年在哲学期刊里很激烈。

## 可复用到的选题

- **「ESS 的 9 年孕育——三个天才一个悲剧」**——以 Hamilton 1964 → Hamilton 1967 → Maynard Smith 1964 → Price 1970/1972 → M-S-Price 1973 为时间线，讲行为生态学奠基期的三人合作。加上 George Price 1975 自杀的人物弧，故事性极强。适合《Nautilus》《Quanta》风格的长篇科普。
- **「差一步——Hamilton 1967 为什么没发明 ESS」**——从 Hamilton "unbeatable strategy" 这个 1967 年术语出发，讨论为什么 Hamilton 拿着所有零件却没组装成 ESS。科学发现里"差一步"的心理学和认知偏误是一个不错的切入角度——Hamilton 太专注于 kin selection 延伸，丢掉了"通用博弈论工具"的抽象野心。
- **「Price equation 到底是什么——选择理论的万能公式 vs 语言学争议」**——Price 1972 协方差方程的哲学地位。它是所有选择理论的统一表达吗？还是只是会计工具？这个元理论争论（Kerr 2013, Gardner 2015, Okasha 2016）从 2000s 延续至今，是哲学生物学的前沿。
