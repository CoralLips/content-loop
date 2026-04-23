import { AbsoluteFill } from 'remotion';
import { theme } from '../../../../theme';
import { usePage, useFadeIn } from '../../../shared/usePage';
import { Annotation } from './Annotation';

export const DURATION = 934;

export const Act4_Reveal: React.FC = () => {
  // 3 页（原 4 页，合并石头故事到一页）
  const p1 = usePage(0, 260);           // 数学证明
  const p2 = usePage(260, 520);         // 算法结构结论
  const p3 = usePage(520, DURATION);    // 石头 · 完整推理链（合并原 Page 3+4）

  // Page 1 累加（0-260f）— 对齐"套回中文房间 / 无穷比特 / 物理装不下"
  const f_fit = useFadeIn(10);
  const f_bits = useFadeIn(100);
  const f_physical = useFadeIn(180);

  // Page 2 累加（260-520f）— 对齐"算法 / 瓦解 / 算法结构"
  const f_algo = useFadeIn(270);
  const f_collapse = useFadeIn(370);
  const f_struct = useFadeIn(440);

  // Page 3 累加（520-934f，13.8s，6 元素，上下两层）
  // 上层：石头 · 泛计算论
  const f_stone = useFadeIn(530);
  const f_pancomp = useFadeIn(590);
  const f_anySystem = useFadeIn(660);
  // 下层：独立输出推导
  const f_indepOut = useFadeIn(780);
  const f_density0 = useFadeIn(850);
  const f_fakeComp = useFadeIn(905);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      {/* Page 1: 数学证明 */}
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div style={{ opacity: f_fit, fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.4, letterSpacing: 2 }}>
          把公式套回中文房间
        </div>
        <div style={{ opacity: f_bits, fontFamily: theme.fonts.mono, fontSize: theme.fontSize.subtitle, color: theme.colors.bad, letterSpacing: 3, marginTop: 24 }}>
          无限对话 · 无穷比特
        </div>
        <div style={{ opacity: f_physical, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.bad, letterSpacing: 4 }}>
          物理装不下
        </div>
      </div>

      {/* Page 2: 算法结构结论 */}
      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, maxWidth: 1700 }}>
        <div style={{ opacity: f_algo, fontFamily: theme.fonts.display, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.45, letterSpacing: 3 }}>
          真能通过图灵测试的房间，<br />
          里面<span style={{ color: theme.colors.accent }}>一定不是表，是算法</span>
        </div>
        <div style={{ opacity: f_collapse, fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.good, letterSpacing: 4, marginTop: 16 }}>
          四十年思想实验 · 自己瓦解
        </div>
        <div style={{ opacity: f_struct, fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.inkDim, letterSpacing: 3, textAlign: 'center', marginTop: 10 }}>
          智能不在那个人身上，在<span style={{ color: theme.colors.accent }}>算法结构</span>里
        </div>
      </div>

      {/* Page 3: 石头完整推理链（6 元素上下两层累加） */}
      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50 }}>
        {/* 上层：问题 → 泛计算论 → 解释 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ opacity: f_stone, fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
            那，石头呢？
          </div>
          <div style={{ opacity: f_pancomp, fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, letterSpacing: 3 }}>
            泛计算论
          </div>
          <div style={{ opacity: f_anySystem, fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, textAlign: 'center', letterSpacing: 2, lineHeight: 1.5, maxWidth: 1600 }}>
            任何物理系统，都能被事后解读为任何计算
          </div>
        </div>

        {/* 下层：推理结论 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginTop: 20 }}>
          <div style={{ opacity: f_indepOut, fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.bad, letterSpacing: 3, textAlign: 'center' }}>
            前后互推得出 · 独立输出 ≈ 0
          </div>
          <div style={{ opacity: f_density0, fontFamily: theme.fonts.mono, fontSize: 96, color: theme.colors.accent, letterSpacing: 4, marginTop: 12 }}>
            密度 ≈ 0
          </div>
          <div style={{ opacity: f_fakeComp, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.good, letterSpacing: 6, marginTop: 14 }}>
            伪计算 · 同样被挡
          </div>
        </div>
      </div>

      <Annotation enter={540} exit={740} term="泛计算论" gloss="Putnam · 石头也在算任何函数" />
    </AbsoluteFill>
  );
};
