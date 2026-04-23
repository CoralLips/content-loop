import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1402;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene7_Agents: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 700);
  const p2 = page(frame, 700, DURATION);

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
          AI 之间
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.35, letterSpacing: 2 }}>
          共享的知识，<br />
          传输成本&nbsp;<span style={{ color: theme.colors.good }}>= 0</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          opacity: p2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
          maxWidth: 1500,
        }}
      >
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.bad, letterSpacing: 10 }}>
          但——
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.35, letterSpacing: 2 }}>
          词汇不对齐，<br />
          仍有<span style={{ color: theme.colors.bad }}>语义瓶颈</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
