import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1076;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene4_Trend: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 360);
  const p2 = page(frame, 360, 760);
  const p3 = page(frame, 760, DURATION);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          核心转向
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.4, letterSpacing: 3, maxWidth: 1600 }}>
          不看<span style={{ color: theme.colors.inkDim }}>此刻的智能密度</span>，<br />
          看<span style={{ color: theme.colors.accent }}>规模变大时它怎么变</span>
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p2, display: 'flex', gap: 140, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24, maxWidth: 600 }}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.bad, letterSpacing: 6 }}>查表型</div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.ink, lineHeight: 1.5 }}>
            更多情况 → 更多规则
          </div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.ink, lineHeight: 1.5 }}>
            描述长度 <span style={{ color: theme.colors.bad }}>线性增长</span>
          </div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.subtitle, color: theme.colors.bad, letterSpacing: 2, marginTop: 16 }}>
            密度 → 0
          </div>
        </div>
        <div style={{ width: 2, alignSelf: 'stretch', backgroundColor: theme.colors.rule }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24, maxWidth: 600 }}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.good, letterSpacing: 6 }}>算法型</div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.ink, lineHeight: 1.5 }}>
            描述长度 <span style={{ color: theme.colors.good }}>固定</span>
          </div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.ink, lineHeight: 1.5 }}>
            情况可以无限扩展
          </div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.subtitle, color: theme.colors.good, letterSpacing: 2, marginTop: 16 }}>
            密度 → ∞
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 38 }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.accent, letterSpacing: 6 }}>
          差别在趋势
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.5, maxWidth: 1500, letterSpacing: 2 }}>
          描述长度不随规模增长，<br />
          就是<span style={{ color: theme.colors.good }}>懂了</span>，不是<span style={{ color: theme.colors.bad }}>记住</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
