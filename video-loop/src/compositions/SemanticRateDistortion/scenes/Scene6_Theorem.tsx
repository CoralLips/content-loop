import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1789;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene6_Theorem: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 620);
  const p2 = page(frame, 620, 1280);
  const p3 = page(frame, 1280, DURATION);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div
        style={{
          position: 'absolute',
          opacity: p1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
        }}
      >
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          定理
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.35, maxWidth: 1500, letterSpacing: 2 }}>
          零失真传输的最小成本，<br />
          等于<span style={{ color: theme.colors.accent }}>只传不可约核</span>的成本
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          opacity: p2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32,
        }}
      >
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.inkDim, letterSpacing: 3 }}>
          冗余事实的传输成本
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 260,
            color: theme.colors.accent,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          = 0
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3 }}>
          数学上严格的零 · 不是近似
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          opacity: p3,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50,
        }}
      >
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          杠杆
        </div>
        <div style={{ display: 'flex', gap: 140, alignItems: 'baseline', fontFamily: theme.fonts.mono }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: theme.fontSize.hero, color: theme.colors.accent, fontWeight: 900 }}>1.5×</span>
            <span style={{ fontSize: theme.fontSize.small, color: theme.colors.inkDim, fontFamily: theme.fonts.body }}>苏格拉底</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: theme.fontSize.hero, color: theme.colors.accent, fontWeight: 900 }}>10×+</span>
            <span style={{ fontSize: theme.fontSize.small, color: theme.colors.inkDim, fontFamily: theme.fonts.body }}>真实知识库</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
