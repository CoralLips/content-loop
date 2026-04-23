import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../../theme';

export const Annotation: React.FC<{
  enter: number;
  exit: number;
  term: string;
  gloss: string;
}> = ({ enter, exit, term, gloss }) => {
  const frame = useCurrentFrame();
  const FADE = 10;
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = Math.min(fi, fo);
  return (
    <div style={{
      position: 'absolute', bottom: 100, left: 0, right: 0, textAlign: 'center',
      opacity, fontFamily: theme.fonts.body, fontSize: theme.fontSize.caption,
      color: theme.colors.inkDim, letterSpacing: 2,
    }}>
      <span style={{ color: theme.colors.accentAlt }}>「{term}」</span>
      <span style={{ margin: '0 14px', color: theme.colors.rule }}>·</span>
      <span>{gloss}</span>
    </div>
  );
};
