import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1489;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene2_Shannon: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 740);
  const p2 = page(frame, 740, DURATION);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div
        style={{
          position: 'absolute',
          opacity: p1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
        }}
      >
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.title, color: theme.colors.accent, letterSpacing: 4 }}>
          Shannon · 1948
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, letterSpacing: 3 }}>
          扔掉了「意义」
        </div>
        <div
          style={{
            maxWidth: 1300,
            fontFamily: theme.fonts.body,
            fontSize: theme.fontSize.body,
            color: theme.colors.inkDim,
            textAlign: 'center',
            lineHeight: 1.5,
            marginTop: 32,
            paddingLeft: 40,
            borderLeft: `4px solid ${theme.colors.inkDim}`,
          }}
        >
          "通信的语义方面与工程问题无关。"
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          opacity: p2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
        }}
      >
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.bad, letterSpacing: 10 }}>
          代价
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.3, maxWidth: 1500 }}>
          假设每条信息<br />都<span style={{ color: theme.colors.accent }}>独立有价值</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
