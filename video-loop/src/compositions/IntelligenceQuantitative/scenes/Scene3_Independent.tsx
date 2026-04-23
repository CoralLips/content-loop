import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1180;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene3_Independent: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 380);
  const p2 = page(frame, 380, 800);
  const p3 = page(frame, 800, DURATION);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          漏洞 · 反例
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.title, color: theme.colors.ink, letterSpacing: 4 }}>
          print(<span style={{ color: theme.colors.accent }}>1, 2, 3, ...</span>)
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3, textAlign: 'center', maxWidth: 1400, marginTop: 16 }}>
          输出无穷多种，智能密度岂不是无穷大？
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50, maxWidth: 1500 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          独立的条件
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.45, letterSpacing: 2 }}>
          看到前一个输出，<br />
          你<span style={{ color: theme.colors.accent }}>无法</span>用更短的程序<br />
          推出下一个
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.body, color: theme.colors.bad, letterSpacing: 4, marginTop: 12 }}>
          5 <span style={{ color: theme.colors.accent, margin: '0 20px' }}>+1</span> 6 <span style={{ color: theme.colors.inkDim, margin: '0 20px' }}>→ 高度依赖，不算</span>
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 46 }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.4, letterSpacing: 2, maxWidth: 1500 }}>
          理想的提问者，用<span style={{ color: theme.colors.accent }}>无限算力</span>，<br />
          也无法从前面的输出预测后面的
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.good, letterSpacing: 4, marginTop: 16 }}>
          这才叫 · 独立
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.inkDim, letterSpacing: 3, marginTop: 16 }}>
          伪多样性，被挡在门外
        </div>
      </div>
    </AbsoluteFill>
  );
};
