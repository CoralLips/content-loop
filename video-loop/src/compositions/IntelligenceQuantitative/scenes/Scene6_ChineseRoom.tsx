import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1374;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene6_ChineseRoom: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 440);
  const p2 = page(frame, 440, 900);
  const p3 = page(frame, 900, DURATION);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          1980 · Searle
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.35, letterSpacing: 2, maxWidth: 1600 }}>
          中文房间
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, textAlign: 'center', lineHeight: 1.5, letterSpacing: 2, maxWidth: 1500 }}>
          不懂中文的人，照查询表答题，能骗过外人
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.bad, letterSpacing: 4, marginTop: 20 }}>
          查表 ≠ 理解？
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.inkDim, letterSpacing: 3 }}>
          AI 界吵了四十年
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          一个估算就够了
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.title, color: theme.colors.ink, letterSpacing: 3, textAlign: 'center', lineHeight: 1.5 }}>
          词汇量 <span style={{ color: theme.colors.accentAlt }}>V</span>　·　对话长度 <span style={{ color: theme.colors.accentAlt }}>L</span>
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 96, color: theme.colors.accent, letterSpacing: 4, marginTop: 16 }}>
          V<sup>L</sup>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.bad, letterSpacing: 3, textAlign: 'center', maxWidth: 1500, marginTop: 16 }}>
          L → ∞，需要<span style={{ color: theme.colors.bad }}>无穷比特</span>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.bad, letterSpacing: 4, marginTop: 10 }}>
          物理装不下
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44, maxWidth: 1700 }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.4, letterSpacing: 3 }}>
          真能通过图灵测试的房间，<br />
          里面<span style={{ color: theme.colors.accent }}>一定不是表，是算法</span>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.good, letterSpacing: 4, marginTop: 16 }}>
          四十年思想实验 · 当场瓦解
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.inkDim, letterSpacing: 3, textAlign: 'center', maxWidth: 1500, marginTop: 8 }}>
          智能不在<span style={{ color: theme.colors.inkDim }}>执行者</span>身上，在<span style={{ color: theme.colors.accent }}>算法结构</span>上
        </div>
      </div>
    </AbsoluteFill>
  );
};
