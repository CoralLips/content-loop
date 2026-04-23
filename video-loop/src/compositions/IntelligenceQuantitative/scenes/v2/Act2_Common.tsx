import { AbsoluteFill } from 'remotion';
import { theme } from '../../../../theme';
import { usePage, useFadeIn } from '../../../shared/usePage';

export const DURATION = 636;

export const Act2_Common: React.FC = () => {
  // 3 页，每页内元素随旁白累加（避免一次性爆发）
  const p1 = usePage(0, 200);           // 常识困惑
  const p2 = usePage(200, 420);         // Searle 中文房间
  const p3 = usePage(420, DURATION);    // 卡住收束

  // Page 1 累加（0-200f）— 对齐旁白"查表也能答题 / 直觉说不对"
  const f_chabiao = useFadeIn(70);
  const f_zhijue = useFadeIn(135);

  // Page 2 累加（200-420f）— 对齐"1980 Searle / 中文房间 / 不懂中文 / 查表≠理解"
  const f_searle = useFadeIn(210);
  const f_room = useFadeIn(240);
  const f_describe = useFadeIn(310);
  const f_notUnderstand = useFadeIn(380);

  // Page 3 累加（420-636f）— 对齐"四十年卡住 / 问题卡住"
  const f_40y = useFadeIn(430);
  const f_stuck = useFadeIn(520);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      {/* Page 1: 常识困惑 */}
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, letterSpacing: 4 }}>
          能答题 = 聪明？
        </div>
        <div style={{ opacity: f_chabiao, fontFamily: theme.fonts.mono, fontSize: theme.fontSize.subtitle, color: theme.colors.bad, letterSpacing: 3, marginTop: 24 }}>
          查表 → 也能答题
        </div>
        <div style={{ opacity: f_zhijue, fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, letterSpacing: 3, marginTop: 8 }}>
          直觉说不对 · 说不上为什么
        </div>
      </div>

      {/* Page 2: Searle 中文房间 */}
      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <div style={{ opacity: f_searle, fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          1980 · Searle
        </div>
        <div style={{ opacity: f_room, fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, letterSpacing: 3 }}>
          中文房间
        </div>
        <div style={{ opacity: f_describe, fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.inkDim, textAlign: 'center', letterSpacing: 2, lineHeight: 1.5, maxWidth: 1500, marginTop: 12 }}>
          不懂中文的人 · 照查询表答题 · 能骗过外人
        </div>
        <div style={{ opacity: f_notUnderstand, fontFamily: theme.fonts.body, fontSize: theme.fontSize.subtitle, color: theme.colors.bad, letterSpacing: 4, marginTop: 24 }}>
          查表 ≠ 理解？
        </div>
      </div>

      {/* Page 3: 卡住收束 */}
      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <div style={{ opacity: f_40y, fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.bad, letterSpacing: 4 }}>
          四十年 · 没人反驳 · 没人证明
        </div>
        <div style={{ opacity: f_stuck, fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.accent, letterSpacing: 6, marginTop: 20 }}>
          问题 · 卡住
        </div>
      </div>
    </AbsoluteFill>
  );
};
