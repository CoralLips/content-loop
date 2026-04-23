import { AbsoluteFill } from 'remotion';
import { theme } from '../../../../theme';
import { usePage, useFadeIn } from '../../../shared/usePage';
import { Annotation } from './Annotation';

export const DURATION = 582;

export const Act5_Coda: React.FC = () => {
  // 2 页（原 3 页，合并 hero + 表格为 Page A）
  const pA = usePage(0, 400);           // hero → 表格 → 智能密度差
  const pB = usePage(400, DURATION);    // 落点收束

  // Page A 内部时序（hero 先独占 0-100f，然后淡出让位给表格）
  const heroLife = usePage(0, 110, 10);  // hero 独立生命周期
  const f_table = useFadeIn(120);
  const f_density = useFadeIn(275);

  // Page B 内部累加
  const f_essence = useFadeIn(410);
  const f_calc = useFadeIn(490);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      {/* Page A: hero → 表格 → 密度差 */}
      <div style={{ position: 'absolute', opacity: pA, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* hero（0-100f 独立） */}
        <div style={{ position: 'absolute', opacity: heroLife, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.4, letterSpacing: 3 }}>
            把公式套回你自己
          </div>
        </div>

        {/* 表格 + 密度差（hero 淡出后浮现） */}
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ opacity: f_table, fontFamily: theme.fonts.mono, fontSize: theme.fontSize.body, color: theme.colors.ink, letterSpacing: 3, lineHeight: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 220px 220px', columnGap: 60, rowGap: 10 }}>
              <div style={{ color: theme.colors.inkDim, textAlign: 'right' }}></div>
              <div style={{ color: theme.colors.inkDim, textAlign: 'center' }}>描述长度</div>
              <div style={{ color: theme.colors.inkDim, textAlign: 'center' }}>输出数</div>
              <div style={{ color: theme.colors.bad, textAlign: 'right' }}>笔记</div>
              <div style={{ textAlign: 'center' }}>10000</div>
              <div style={{ textAlign: 'center' }}>10000</div>
              <div style={{ color: theme.colors.good, textAlign: 'right' }}>原则</div>
              <div style={{ textAlign: 'center' }}>10</div>
              <div style={{ textAlign: 'center' }}>10000</div>
            </div>
          </div>
          <div style={{ opacity: f_density, fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.accent, letterSpacing: 4, marginTop: 28 }}>
            智能密度差 <span style={{ color: theme.colors.ink }}>1000×</span>
          </div>
        </div>
      </div>

      {/* Page B: 落点 */}
      <div style={{ position: 'absolute', opacity: pB, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, maxWidth: 1700 }}>
        <div style={{ opacity: f_essence, fontFamily: theme.fonts.display, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.45, letterSpacing: 3 }}>
          差别不在<span style={{ color: theme.colors.inkDim }}>感觉</span>，<br />
          在<span style={{ color: theme.colors.accent }}>描述长度会不会随规模膨胀</span>
        </div>
        <div style={{ opacity: f_calc, fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.good, textAlign: 'center', letterSpacing: 3, marginTop: 16 }}>
          记住 / 懂了 · 那条线，现在可以算
        </div>
      </div>

      <Annotation enter={210} exit={400} term="智能密度" gloss="独立输出 ÷ 描述长度" />
    </AbsoluteFill>
  );
};
