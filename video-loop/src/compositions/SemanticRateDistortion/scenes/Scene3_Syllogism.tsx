import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1406;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

const FACTS = ['所有人都会死', '苏格拉底是人', '苏格拉底会死'];

export const Scene3_Syllogism: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 700);
  const p2 = page(frame, 700, DURATION);

  const listBlock = (redundant: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36, fontFamily: theme.fonts.display, fontSize: theme.fontSize.subtitle }}>
      {FACTS.map((f, i) => {
        const isThird = i === 2;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28, color: isThird && redundant ? theme.colors.bad : theme.colors.ink }}>
            <span style={{ color: theme.colors.inkDim, fontSize: theme.fontSize.body * 0.75 }}>{i + 1}.</span>
            <span style={{ minWidth: 520, textDecoration: isThird && redundant ? 'line-through' : 'none', textDecorationColor: theme.colors.bad, textDecorationThickness: 4 }}>{f}</span>
            {isThird && redundant && (
              <span style={{ fontSize: theme.fontSize.small, color: theme.colors.bad, border: `2px solid ${theme.colors.bad}`, padding: '4px 14px', borderRadius: 4 }}>不用传</span>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div style={{ position: 'absolute', opacity: p1 }}>
        {listBlock(false)}
      </div>

      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60 }}>
        {listBlock(true)}
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3 }}>
          Shannon 看不懂这件事
        </div>
      </div>
    </AbsoluteFill>
  );
};
