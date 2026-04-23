import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1370;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene4_Closure: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 680);
  const p2 = page(frame, 680, DURATION);

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
          letterSpacing: 3,
        }}
      >
        什么叫「<span style={{ color: theme.colors.accent }}>传到了</span>」？
      </div>

      <div
        style={{
          position: 'absolute',
          opacity: p2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50,
          maxWidth: 1500,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 24, fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim }}>
            <span style={{ letterSpacing: 4 }}>旧</span>
            <span>字符一致</span>
          </div>
          <div style={{ display: 'flex', gap: 24, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.ink }}>
            <span style={{ letterSpacing: 4, color: theme.colors.accent }}>新</span>
            <span>能推出的<span style={{ color: theme.colors.accent }}>结论</span>一致</span>
          </div>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3, display: 'flex', alignItems: 'center', gap: 28 }}>
          <span>字符层面</span>
          <span style={{ color: theme.colors.accent, fontSize: theme.fontSize.subtitle }}>→</span>
          <span style={{ color: theme.colors.ink }}>逻辑层面</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
