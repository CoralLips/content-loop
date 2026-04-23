import { AbsoluteFill } from 'remotion';
import { theme } from '../../../../theme';
import { usePage } from '../../../shared/usePage';

export const DURATION = 613;

export const Act2_Shannon: React.FC = () => {
  const p1 = usePage(0, 220);
  const p2 = usePage(220, 440);
  const p3 = usePage(440, DURATION);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      {/* p1: Shannon 1948 */}
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.title, color: theme.colors.accent, letterSpacing: 4 }}>
          Shannon · 1948
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3 }}>
          微信 · 电话 · 无线网的地基
        </div>
      </div>

      {/* p2: 三个孤立圆圈 + 前提 */}
      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.bad, letterSpacing: 10 }}>
          前提
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, textAlign: 'center', letterSpacing: 2 }}>
          每条信息<span style={{ color: theme.colors.accent }}>独立</span>有价值
        </div>
        <div style={{ display: 'flex', gap: 80, marginTop: 24 }}>
          {['A', 'B', 'C'].map((x) => (
            <div key={x} style={{
              width: 140, height: 140, borderRadius: '50%',
              border: `3px solid ${theme.colors.inkDim}`,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontFamily: theme.fonts.mono, fontSize: 56, color: theme.colors.inkDim,
            }}>{x}</div>
          ))}
        </div>
      </div>

      {/* p3: 露馅（三段论 + 推出箭头） */}
      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          但苏格拉底…
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, fontFamily: theme.fonts.display, fontSize: theme.fontSize.body }}>
          <div style={{ color: theme.colors.ink, display: 'flex', gap: 24 }}><span style={{ color: theme.colors.inkDim }}>1.</span><span>所有人都会死</span></div>
          <div style={{ color: theme.colors.ink, display: 'flex', gap: 24 }}><span style={{ color: theme.colors.inkDim }}>2.</span><span>苏格拉底是人</span></div>
          <div style={{ color: theme.colors.accent, fontSize: theme.fontSize.subtitle, textAlign: 'center', margin: '4px 0' }}>↓</div>
          <div style={{ color: theme.colors.accent, display: 'flex', gap: 24, fontWeight: 700 }}><span style={{ color: theme.colors.inkDim }}>3.</span><span>苏格拉底会死</span></div>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3, marginTop: 16 }}>
          Shannon 看不见这件事
        </div>
      </div>
    </AbsoluteFill>
  );
};
