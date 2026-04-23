import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1880;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene5_Multiplication: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 460);
  const p2 = page(frame, 460, 920);
  const p3 = page(frame, 920, 1460);
  const p4 = page(frame, 1460, DURATION);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 140 }}>
      <div style={{ position: 'absolute', opacity: p1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
          一个能跟着算的例子 · 做乘法
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, letterSpacing: 3 }}>
          两种「会做乘法」的系统
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 28, maxWidth: 1500 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.bad, letterSpacing: 6 }}>方案 A · 查表</div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.ink, lineHeight: 1.5 }}>
          预存所有可能的乘法结果
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.body, color: theme.colors.accent, letterSpacing: 3 }}>
          1×1 位 → 81 种 → 约 567 比特
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.ink, lineHeight: 1.5 }}>
          查 3×4，得 12 ✓
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.bad, lineHeight: 1.5, marginTop: 12 }}>
          但 10×10 位？结果有 10<sup>20</sup> 种 · 存不下
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 28, maxWidth: 1500 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.good, letterSpacing: 6 }}>方案 B · 算法</div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.ink, lineHeight: 1.5 }}>
          拆位 · 单位相乘 · 进位 · 累加
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.body, color: theme.colors.accent, letterSpacing: 3 }}>
          算法 + 9×9 小表 = 约 667 比特
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.ink, lineHeight: 1.5 }}>
          3×4 ? 算　·　12345×67890 ? 还是算
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.good, lineHeight: 1.5, marginTop: 12 }}>
          永远是那 667 比特
        </div>
      </div>

      <div style={{ position: 'absolute', opacity: p4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10, marginBottom: 16 }}>
          智能密度 vs 规模
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.body, color: theme.colors.ink, lineHeight: 2.0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 220px 220px', columnGap: 60, rowGap: 10 }}>
            <div style={{ color: theme.colors.inkDim, textAlign: 'right' }}>规模</div>
            <div style={{ color: theme.colors.bad, textAlign: 'center' }}>方案 A</div>
            <div style={{ color: theme.colors.good, textAlign: 'center' }}>方案 B</div>
            <div style={{ color: theme.colors.inkDim, textAlign: 'right' }}>1×1</div>
            <div style={{ textAlign: 'center' }}>0.011</div>
            <div style={{ textAlign: 'center' }}>0.010</div>
            <div style={{ color: theme.colors.inkDim, textAlign: 'right' }}>10×10</div>
            <div style={{ color: theme.colors.bad, textAlign: 'center' }}>≈ 0</div>
            <div style={{ color: theme.colors.good, textAlign: 'center' }}>0.10</div>
            <div style={{ color: theme.colors.inkDim, textAlign: 'right' }}>100×100</div>
            <div style={{ color: theme.colors.bad, textAlign: 'center' }}>→ 0</div>
            <div style={{ color: theme.colors.good, textAlign: 'center' }}>1.0</div>
            <div style={{ color: theme.colors.inkDim, textAlign: 'right' }}>n→∞</div>
            <div style={{ color: theme.colors.bad, textAlign: 'center' }}>0</div>
            <div style={{ color: theme.colors.good, textAlign: 'center' }}>∞</div>
          </div>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.ink, letterSpacing: 2, textAlign: 'center', marginTop: 16, maxWidth: 1400 }}>
          差别不在<span style={{ color: theme.colors.inkDim }}>能不能算对</span>，在<span style={{ color: theme.colors.accent }}>描述长度会不会膨胀</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
