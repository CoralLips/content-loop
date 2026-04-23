import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1987;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene5_Core: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 620);           // 算法描述
  const p2 = page(frame, 620, 1240);         // 检查结果 + 不可约核
  const p3 = page(frame, 1240, DURATION);    // 80%

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div
        style={{
          position: 'absolute',
          opacity: p1,
          fontFamily: theme.fonts.display,
          fontSize: theme.fontSize.title,
          color: theme.colors.ink,
          textAlign: 'center',
          lineHeight: 1.35,
          letterSpacing: 2,
          maxWidth: 1500,
        }}
      >
        逐条检查，<br />
        <span style={{ color: theme.colors.accent }}>能被推出的</span>就删
      </div>

      <div
        style={{
          position: 'absolute',
          opacity: p2,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22,
          fontFamily: theme.fonts.body,
          fontSize: theme.fontSize.subtitle,
        }}
      >
        <div style={{ color: theme.colors.bad, display: 'flex', alignItems: 'center', gap: 24 }}>
          <s style={{ minWidth: 440 }}>苏格拉底会死</s>
          <span style={{ fontSize: theme.fontSize.small, color: theme.colors.bad, border: `2px solid ${theme.colors.bad}`, padding: '4px 14px', borderRadius: 4 }}>删</span>
        </div>
        <div style={{ color: theme.colors.ink, display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ minWidth: 440 }}>所有人都会死</span>
          <span style={{ fontSize: theme.fontSize.small, color: theme.colors.good, border: `2px solid ${theme.colors.good}`, padding: '4px 14px', borderRadius: 4 }}>留</span>
        </div>
        <div style={{ color: theme.colors.ink, display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ minWidth: 440 }}>苏格拉底是人</span>
          <span style={{ fontSize: theme.fontSize.small, color: theme.colors.good, border: `2px solid ${theme.colors.good}`, padding: '4px 14px', borderRadius: 4 }}>留</span>
        </div>
        <div style={{ marginTop: 50, fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.accent, letterSpacing: 3 }}>
          = 不可约核
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          opacity: p3,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36,
        }}
      >
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3 }}>
          真实知识库的冗余率
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: theme.fontSize.hero,
            color: theme.colors.accent,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          80%+
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, textAlign: 'center', maxWidth: 1200, letterSpacing: 2 }}>
          必需的核只有五分之一 · 其余全是推论
        </div>
      </div>
    </AbsoluteFill>
  );
};
