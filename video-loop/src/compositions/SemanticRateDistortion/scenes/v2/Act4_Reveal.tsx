import { AbsoluteFill } from 'remotion';
import { theme } from '../../../../theme';
import { usePage } from '../../../shared/usePage';

export const DURATION = 768;

export const Act4_Reveal: React.FC = () => {
  const p1 = usePage(0, 260);
  const p2 = usePage(260, 530);
  const p3 = usePage(530, DURATION);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      {/* p1: 核心定理 */}
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          定理
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.35, maxWidth: 1500, letterSpacing: 2 }}>
          零失真传输的最小成本，<br />
          等于<span style={{ color: theme.colors.accent }}>只传不可约核</span>的成本
        </div>
      </div>

      {/* p2: = 0 特写 */}
      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.inkDim, letterSpacing: 3 }}>
          核以外所有冗余事实
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 260, color: theme.colors.accent, fontWeight: 900, lineHeight: 1 }}>
          = 0
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3 }}>
          严格 · 不是近似
        </div>
      </div>

      {/* p3: 冗余率 80%+ */}
      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3 }}>
          真实知识库的冗余率
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.hero, color: theme.colors.accent, fontWeight: 900, lineHeight: 1 }}>
          80%+
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, textAlign: 'center', maxWidth: 1400, letterSpacing: 2 }}>
          Shannon 熵下限 · 78 年首次被压穿
        </div>
      </div>
    </AbsoluteFill>
  );
};
