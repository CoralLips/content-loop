import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1742;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 870);
  const p2 = page(frame, 870, DURATION);

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
          maxWidth: 1500,
          letterSpacing: 2,
        }}
      >
        好老师讲课，<br />
        为什么不念每一条<span style={{ color: theme.colors.accent }}>推论</span>？
      </div>

      <div
        style={{
          position: 'absolute',
          opacity: p2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: theme.fontSize.title,
            color: theme.colors.ink,
            letterSpacing: 2,
          }}
        >
          这个直觉，<span style={{ color: theme.colors.accent }}>78 年</span>没人证过
        </div>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: theme.fontSize.subtitle,
            color: theme.colors.inkDim,
            letterSpacing: 3,
          }}
        >
          直到这个月
        </div>
      </div>
    </AbsoluteFill>
  );
};
