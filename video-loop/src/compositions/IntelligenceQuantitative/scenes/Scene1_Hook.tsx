import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 239;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, DURATION);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 56 }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.hero, color: theme.colors.ink, letterSpacing: 4 }}>
          什么是<span style={{ color: theme.colors.accent }}>智能</span>？
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.inkDim, letterSpacing: 6 }}>
          哲学家吵了<span style={{ color: theme.colors.ink }}>两千年</span>　·　AI 界吵了<span style={{ color: theme.colors.ink }}>七十年</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
