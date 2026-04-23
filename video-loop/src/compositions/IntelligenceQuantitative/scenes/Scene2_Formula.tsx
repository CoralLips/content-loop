import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 909;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene2_Formula: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 300);
  const p2 = page(frame, 300, 620);
  const p3 = page(frame, 620, DURATION);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          这个月的论文
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.35, maxWidth: 1500, letterSpacing: 2 }}>
          一个<span style={{ color: theme.colors.accent }}>干净利落</span>的答案
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          智能密度
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 84, color: theme.colors.ink, textAlign: 'center', letterSpacing: 3, lineHeight: 1.4 }}>
          <span style={{ color: theme.colors.accent }}>log</span>(<span style={{ color: theme.colors.accentAlt }}>独立输出</span>)
          <div style={{ height: 4, backgroundColor: theme.colors.rule, margin: '24px auto', width: 720 }} />
          <span style={{ color: theme.colors.good }}>描述长度</span>
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', gap: 42, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, lineHeight: 1.4 }}>
        <div><span style={{ color: theme.colors.good, letterSpacing: 4, display: 'inline-block', minWidth: 240 }}>描述长度</span>系统写下来需要多少比特</div>
        <div><span style={{ color: theme.colors.accentAlt, letterSpacing: 4, display: 'inline-block', minWidth: 240 }}>独立输出</span>能做出多少互相推不出的回答</div>
        <div style={{ marginTop: 24, fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.accent, textAlign: 'center', letterSpacing: 4 }}>
          两者一比 = 智能密度
        </div>
      </div>
    </AbsoluteFill>
  );
};
