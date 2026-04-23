import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1067;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene8_Self: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 380);
  const p2 = page(frame, 380, 740);
  const p3 = page(frame, 740, DURATION);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          把公式套回你自己
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.4, letterSpacing: 3, maxWidth: 1700 }}>
          一万条<span style={{ color: theme.colors.bad }}>笔记</span>，<br />
          还是十条能组合出一万洞察的<span style={{ color: theme.colors.good }}>原则</span>？
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.body, color: theme.colors.ink, lineHeight: 2, letterSpacing: 3 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 260px 200px', columnGap: 40, rowGap: 14 }}>
            <div style={{ color: theme.colors.inkDim, textAlign: 'right' }}></div>
            <div style={{ color: theme.colors.inkDim, textAlign: 'center' }}>描述长度</div>
            <div style={{ color: theme.colors.inkDim, textAlign: 'center' }}>输出数</div>
            <div style={{ color: theme.colors.bad, textAlign: 'right' }}>笔记</div>
            <div style={{ textAlign: 'center' }}>10000</div>
            <div style={{ textAlign: 'center' }}>10000</div>
            <div style={{ color: theme.colors.good, textAlign: 'right' }}>原则</div>
            <div style={{ textAlign: 'center' }}>10</div>
            <div style={{ textAlign: 'center' }}>10000</div>
          </div>
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.accent, letterSpacing: 4, marginTop: 36 }}>
          智能密度差 <span style={{ color: theme.colors.ink }}>1000×</span>
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 38, maxWidth: 1700 }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.45, letterSpacing: 3 }}>
          差别不在<span style={{ color: theme.colors.inkDim }}>感觉</span>，<br />
          在<span style={{ color: theme.colors.accent }}>描述长度会不会随规模膨胀</span>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.good, textAlign: 'center', letterSpacing: 3, marginTop: 12 }}>
          记住 / 懂了，那条线，现在可以算
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.caption, color: theme.colors.inkDim, letterSpacing: 2, marginTop: 20 }}>
          arxiv.org/abs/2604.10873
        </div>
      </div>
    </AbsoluteFill>
  );
};
