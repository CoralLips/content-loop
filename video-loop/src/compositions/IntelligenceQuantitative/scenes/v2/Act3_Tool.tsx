import { AbsoluteFill } from 'remotion';
import { theme } from '../../../../theme';
import { usePage, useFadeIn } from '../../../shared/usePage';
import { Annotation } from './Annotation';

export const DURATION = 666;

export const Act3_Tool: React.FC = () => {
  // 3 页，每页内元素累加
  const p1 = usePage(0, 240);           // 三定义
  const p2 = usePage(240, 460);         // 独立性
  const p3 = usePage(460, DURATION);    // 反例

  // Page 1 累加（0-240f）— 对齐"描述长度 / 独立输出 / 智能密度"
  const f_desc = useFadeIn(10);
  const f_output = useFadeIn(90);
  const f_density = useFadeIn(170);

  // Page 2 累加（240-460f）— 对齐"关键独立 / 无法用更短程序推出"
  const f_key = useFadeIn(250);
  const f_def = useFadeIn(300);

  // Page 3 累加（460-666f）— 对齐"print 123 / 5→6 推 / 伪多样性被挡"
  const f_print = useFadeIn(470);
  const f_plus1 = useFadeIn(545);
  const f_pseudo = useFadeIn(605);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      {/* Page 1: 三定义 */}
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26, maxWidth: 1500 }}>
        <div style={{ opacity: f_desc, display: 'flex', gap: 28, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, alignItems: 'center' }}>
          <span style={{ color: theme.colors.accentAlt, letterSpacing: 4, minWidth: 140 }}>描述长度</span>
          <span>写下系统 · 要多少比特</span>
        </div>
        <div style={{ opacity: f_output, display: 'flex', gap: 28, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, alignItems: 'center' }}>
          <span style={{ color: theme.colors.accentAlt, letterSpacing: 4, minWidth: 140 }}>独立输出</span>
          <span>互相推不出的回答 · 有多少个</span>
        </div>
        <div style={{ opacity: f_density, display: 'flex', gap: 28, fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.accent, alignItems: 'center', marginTop: 12 }}>
          <span style={{ letterSpacing: 6, minWidth: 140 }}>智能密度</span>
          <span style={{ fontSize: theme.fontSize.subtitle, color: theme.colors.ink }}>= 两者相比</span>
        </div>
      </div>

      {/* Page 2: 独立性定义 */}
      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>
        <div style={{ opacity: f_key, fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          关键 · 独立
        </div>
        <div style={{ opacity: f_def, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.ink, textAlign: 'center', letterSpacing: 2, lineHeight: 1.45, maxWidth: 1700 }}>
          看到前一个输出，<br />
          <span style={{ color: theme.colors.accent }}>无法用更短的程序推出下一个</span>
        </div>
      </div>

      {/* Page 3: 反例 */}
      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <div style={{ opacity: f_print, fontFamily: theme.fonts.mono, fontSize: theme.fontSize.title, color: theme.colors.ink, letterSpacing: 4 }}>
          <span style={{ color: theme.colors.inkDim }}>print(</span>
          1, 2, 3
          <span style={{ color: theme.colors.inkDim }}>)</span>
        </div>
        <div style={{ opacity: f_plus1, fontFamily: theme.fonts.mono, fontSize: theme.fontSize.body, color: theme.colors.bad, letterSpacing: 3 }}>
          5 → 6 · 一个 +1 就能推
        </div>
        <div style={{ opacity: f_pseudo, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.bad, letterSpacing: 4, marginTop: 20 }}>
          伪多样性 · 被挡在门外
        </div>
      </div>

      <Annotation enter={20} exit={220} term="描述长度" gloss="写下这个系统所需的最少信息量" />
      <Annotation enter={480} exit={DURATION - 20} term="独立输出" gloss="输出之间互相推不出来" />
    </AbsoluteFill>
  );
};
