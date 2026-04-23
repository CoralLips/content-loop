import { interpolate, useCurrentFrame } from 'remotion';

// 页面整体淡入淡出 — 用于 Page 之间的切换
export function usePage(enter: number, exit: number, fade = 12): number {
  const frame = useCurrentFrame();
  const fi = interpolate(frame, [enter, enter + fade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fo = interpolate(frame, [exit - fade, exit], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return Math.min(fi, fo);
}

// 单元素淡入（只 fade-in 不 fade-out）— 用于 Page 内部的元素累加
export function useFadeIn(at: number, fade = 12): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + fade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}
