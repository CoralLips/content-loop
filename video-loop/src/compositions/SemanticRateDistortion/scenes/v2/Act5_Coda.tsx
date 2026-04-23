import { AbsoluteFill } from 'remotion';
import { theme } from '../../../../theme';
import { usePage } from '../../../shared/usePage';

export const DURATION = 476;

export const Act5_Coda: React.FC = () => {
  const p1 = usePage(0, 180);
  const p2 = usePage(180, 330);
  const p3 = usePage(330, DURATION);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      {/* p1: 三层演进 */}
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          信息论的三层
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36, fontFamily: theme.fonts.display, fontSize: theme.fontSize.subtitle }}>
          <span style={{ color: theme.colors.inkDim }}>无结构</span>
          <span style={{ color: theme.colors.accent, fontSize: theme.fontSize.title }}>→</span>
          <span style={{ color: theme.colors.accentAlt }}>有语义</span>
          <span style={{ color: theme.colors.accent, fontSize: theme.fontSize.title }}>→</span>
          <span style={{ color: theme.colors.accent, fontWeight: 700 }}>有逻辑</span>
        </div>
      </div>

      {/* p2: punchline */}
      <div style={{
        position: 'absolute', opacity: p2,
        fontFamily: theme.fonts.display, fontSize: theme.fontSize.title,
        color: theme.colors.ink, textAlign: 'center', lineHeight: 1.35, letterSpacing: 3, maxWidth: 1600,
      }}>
        <span style={{ color: theme.colors.accent }}>意义</span>不是负担，<br />
        是<span style={{ color: theme.colors.good }}>新的压缩维度</span>
      </div>

      {/* p3: 推理能力 = 带宽 + credits */}
      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60 }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, textAlign: 'center', letterSpacing: 3, lineHeight: 1.4 }}>
          推理能力本身，<br />就是<span style={{ color: theme.colors.accent }}>带宽的增益</span>
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.caption, color: theme.colors.inkDim, letterSpacing: 2 }}>
          arxiv.org/abs/2604.11204
        </div>
      </div>
    </AbsoluteFill>
  );
};
