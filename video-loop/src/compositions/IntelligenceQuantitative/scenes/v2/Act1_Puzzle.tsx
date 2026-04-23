import { AbsoluteFill } from 'remotion';
import { theme } from '../../../../theme';
import { usePage, useFadeIn } from '../../../shared/usePage';

export const DURATION = 338;

export const Act1_Puzzle: React.FC = () => {
  // Page A: 问题 + 困境累加（0 - 220 frames, ~7.3s）
  // Page B: 收束钩子（220 - 338 frames, ~3.9s）
  const pageA = usePage(0, 220, 10);
  const pageB = usePage(220, DURATION, 10);

  // Page A 内元素累加时序（相对 Act 起点）
  const fade2000y = useFadeIn(60);     // 哲学家 · 两千年
  const fade70y = useFadeIn(100);      // AI 界 · 七十年
  const fadeNoNumber = useFadeIn(150); // 没人能变成一个数字

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      {/* Page A: 问题 hero + 下方困境三行累加 */}
      <div style={{ position: 'absolute', opacity: pageA, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.hero, color: theme.colors.ink, letterSpacing: 6 }}>
          什么是智能？
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginTop: 20 }}>
          <div style={{ opacity: fade2000y, fontFamily: theme.fonts.mono, fontSize: theme.fontSize.subtitle, color: theme.colors.inkDim, letterSpacing: 3 }}>
            哲学家 · <span style={{ color: theme.colors.accent }}>两千年</span>
          </div>
          <div style={{ opacity: fade70y, fontFamily: theme.fonts.mono, fontSize: theme.fontSize.subtitle, color: theme.colors.inkDim, letterSpacing: 3 }}>
            AI 界 · <span style={{ color: theme.colors.accent }}>七十年</span>
          </div>
          <div style={{ opacity: fadeNoNumber, fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.bad, letterSpacing: 3, marginTop: 20 }}>
            没人能变成一个数字
          </div>
        </div>
      </div>

      {/* Page B: 收束钩子 */}
      <div style={{ position: 'absolute', opacity: pageB, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, textAlign: 'center', letterSpacing: 3, lineHeight: 1.5 }}>
          一个定义都立不住，<br />
          整个学科就<span style={{ color: theme.colors.bad }}>没有底</span>
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.good, letterSpacing: 8, marginTop: 32 }}>
          直到这个月
        </div>
      </div>
    </AbsoluteFill>
  );
};
