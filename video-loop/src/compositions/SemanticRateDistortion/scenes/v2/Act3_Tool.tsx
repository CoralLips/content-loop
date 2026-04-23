import { AbsoluteFill } from 'remotion';
import { theme } from '../../../../theme';
import { usePage } from '../../../shared/usePage';
import { Annotation } from './Annotation';

export const DURATION = 767;

export const Act3_Tool: React.FC = () => {
  const p1 = usePage(0, 260);
  const p2 = usePage(260, 500);
  const p3 = usePage(500, DURATION);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      {/* p1: 新旧判据对比 */}
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 40, maxWidth: 1500 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          重新定义「传到了」
        </div>
        <div style={{ display: 'flex', gap: 32, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.inkDim }}>
          <span style={{ letterSpacing: 4, color: theme.colors.inkDim, minWidth: 80 }}>旧</span>
          <span>字符对齐</span>
        </div>
        <div style={{ display: 'flex', gap: 32, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.ink }}>
          <span style={{ letterSpacing: 4, color: theme.colors.accent, minWidth: 80 }}>新</span>
          <span>能推出的<span style={{ color: theme.colors.accent }}>结论</span>对齐</span>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3, marginTop: 24 }}>
          字符层 <span style={{ color: theme.colors.accent, margin: '0 16px' }}>→</span> 逻辑层
        </div>
      </div>

      {/* p2: 苏格拉底演示 + 推理闭包注解 */}
      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, fontFamily: theme.fonts.display, fontSize: theme.fontSize.body }}>
          <div style={{ color: theme.colors.ink, display: 'flex', gap: 20 }}><span style={{ color: theme.colors.good, minWidth: 60 }}>传</span><span>所有人都会死</span></div>
          <div style={{ color: theme.colors.ink, display: 'flex', gap: 20 }}><span style={{ color: theme.colors.good, minWidth: 60 }}>传</span><span>苏格拉底是人</span></div>
          <div style={{ color: theme.colors.accentAlt, display: 'flex', gap: 20 }}><span style={{ color: theme.colors.accentAlt, minWidth: 60 }}>推</span><span>苏格拉底会死</span></div>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.good, letterSpacing: 3, marginTop: 16 }}>
          推理闭包一致 · 传输完成
        </div>
      </div>

      {/* p3: 反向检查 + 不可约核 */}
      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10, marginBottom: 16 }}>
          逐条反向检查
        </div>
        <div style={{ color: theme.colors.bad, display: 'flex', alignItems: 'center', gap: 24 }}>
          <s style={{ minWidth: 440 }}>苏格拉底会死</s>
          <span style={{ fontSize: theme.fontSize.small, color: theme.colors.bad, border: `2px solid ${theme.colors.bad}`, padding: '4px 14px', borderRadius: 4 }}>能推出，删</span>
        </div>
        <div style={{ color: theme.colors.ink, display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ minWidth: 440 }}>所有人都会死</span>
          <span style={{ fontSize: theme.fontSize.small, color: theme.colors.good, border: `2px solid ${theme.colors.good}`, padding: '4px 14px', borderRadius: 4 }}>留</span>
        </div>
        <div style={{ color: theme.colors.ink, display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ minWidth: 440 }}>苏格拉底是人</span>
          <span style={{ fontSize: theme.fontSize.small, color: theme.colors.good, border: `2px solid ${theme.colors.good}`, padding: '4px 14px', borderRadius: 4 }}>留</span>
        </div>
        <div style={{ marginTop: 40, fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.accent, letterSpacing: 3 }}>
          = 不可约核
        </div>
      </div>

      {/* 注解：p2 段内"推理闭包" */}
      <Annotation enter={320} exit={500} term="推理闭包" gloss="所有能从已知推出来的结论" />
      {/* 注解：p3 段末"不可约核" */}
      <Annotation enter={680} exit={DURATION} term="不可约核" gloss="一条都不能少的最小集合" />
    </AbsoluteFill>
  );
};
