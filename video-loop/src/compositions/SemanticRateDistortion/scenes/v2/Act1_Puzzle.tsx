import { AbsoluteFill } from 'remotion';
import { theme } from '../../../../theme';
import { usePage } from '../../../shared/usePage';

export const DURATION = 468;

const FACTS = ['所有人都会死', '苏格拉底是人', '苏格拉底会死'];

export const Act1_Puzzle: React.FC = () => {
  const p1 = usePage(0, 200);
  const p2 = usePage(200, 340);
  const p3 = usePage(340, DURATION);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      {/* p1: 三段论 */}
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', gap: 32, fontFamily: theme.fonts.display, fontSize: theme.fontSize.subtitle }}>
        {FACTS.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28, color: theme.colors.ink }}>
            <span style={{ color: theme.colors.inkDim, fontSize: theme.fontSize.body * 0.75 }}>{i + 1}.</span>
            <span style={{ minWidth: 560 }}>{f}</span>
            {i === 2 && (
              <span style={{ color: theme.colors.accent, fontSize: theme.fontSize.small, letterSpacing: 2 }}>← 能推出</span>
            )}
          </div>
        ))}
      </div>

      {/* p2: 第三条变灰 + 上方冒出"免费？" */}
      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.accent, letterSpacing: 3 }}>
          只传前两条，第三条<span style={{ color: theme.colors.ink }}>免费</span>？
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: theme.fonts.display, fontSize: theme.fontSize.body }}>
          {FACTS.map((f, i) => (
            <div key={i} style={{ color: i === 2 ? theme.colors.rule : theme.colors.ink, display: 'flex', gap: 24 }}>
              <span style={{ color: theme.colors.inkDim, fontSize: theme.fontSize.body * 0.75 }}>{i + 1}.</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3 }}>
          直觉<span style={{ color: theme.colors.good }}>：差不多</span> · 信息论<span style={{ color: theme.colors.bad }}>：不行</span>
        </div>
      </div>

      {/* p3: = 0 特写 */}
      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          本月证明
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 280, color: theme.colors.accent, fontWeight: 900, lineHeight: 1 }}>
          = 0
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3 }}>
          数学定理里的零 · 不是近似
        </div>
      </div>
    </AbsoluteFill>
  );
};
