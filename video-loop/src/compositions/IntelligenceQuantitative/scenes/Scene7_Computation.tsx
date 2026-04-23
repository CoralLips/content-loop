import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1906;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene7_Computation: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 480);
  const p2 = page(frame, 480, 960);
  const p3 = page(frame, 960, 1440);
  const p4 = page(frame, 1440, DURATION);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          另一个四十年老难题
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.35, letterSpacing: 3 }}>
          泛计算论 · Putnam
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, textAlign: 'center', lineHeight: 1.5, letterSpacing: 2, maxWidth: 1600, marginTop: 8 }}>
          任何物理系统，都可被事后解读为计算任何函数
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.bad, letterSpacing: 4, marginTop: 12 }}>
          那，一块石头也在计算吗？
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 42 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          论文的回应
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.4, letterSpacing: 2, maxWidth: 1700 }}>
          重新贴标签，<br />
          <span style={{ color: theme.colors.accent }}>不产生独立输出</span>
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, letterSpacing: 3, textAlign: 'center', lineHeight: 1.6 }}>
          <span style={{ color: theme.colors.inkDim }}>t₁ 的分子运动</span>
          <span style={{ color: theme.colors.accent, margin: '0 28px' }}>→</span>
          <span style={{ color: theme.colors.inkDim }}>t₂ 的状态</span>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.bad, letterSpacing: 3, textAlign: 'center', maxWidth: 1500, marginTop: 12 }}>
          t₂ 本来就能从 t₁ 推出 · 不是独立的
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 128, color: theme.colors.accent, letterSpacing: 4, marginTop: 32 }}>
          密度 ≈ 0
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.good, letterSpacing: 6 }}>
          过滤器
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.45, letterSpacing: 3, maxWidth: 1700 }}>
          独立性条件，<br />
          专门把<span style={{ color: theme.colors.bad }}>伪计算</span>挡在门外
        </div>
      </div>
    </AbsoluteFill>
  );
};
