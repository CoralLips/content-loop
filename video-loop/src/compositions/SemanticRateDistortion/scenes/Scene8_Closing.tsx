import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../../../theme';

export const DURATION = 1899;

const FADE = 12;
const page = (frame: number, enter: number, exit: number) => {
  const fi = interpolate(frame, [enter, enter + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fo = interpolate(frame, [exit - FADE, exit], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(fi, fo);
};

export const Scene8_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = page(frame, 0, 630);           // 三层递进
  const p2 = page(frame, 630, 1240);        // punchline
  const p3 = page(frame, 1240, DURATION);   // credits

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 160 }}>
      <div
        style={{
          position: 'absolute',
          opacity: p1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50,
        }}
      >
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

      <div
        style={{
          position: 'absolute',
          opacity: p2,
          fontFamily: theme.fonts.display,
          fontSize: theme.fontSize.title,
          color: theme.colors.ink,
          textAlign: 'center',
          lineHeight: 1.35,
          letterSpacing: 3,
          maxWidth: 1600,
        }}
      >
        <span style={{ color: theme.colors.accent }}>意义</span>
        不是负担，<br />
        是<span style={{ color: theme.colors.good }}>免费带宽</span>
      </div>

      <div
        style={{
          position: 'absolute',
          opacity: p3,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 80,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
            — 原文 —
          </div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.body, color: theme.colors.ink, textAlign: 'center', lineHeight: 1.5 }}>
            Semantic Rate-Distortion Theory:<br />
            Deductive Compression and Closure Fidelity
          </div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.fontSize.small, color: theme.colors.accentAlt, letterSpacing: 2 }}>
            arxiv.org/abs/2604.11204
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: theme.fontSize.small, color: theme.colors.accent, letterSpacing: 10 }}>
            — 编辑 —
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontSize: theme.fontSize.title, color: theme.colors.ink, letterSpacing: 4 }}>
            奕子哥
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
