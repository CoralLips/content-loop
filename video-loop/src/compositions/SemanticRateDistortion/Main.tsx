import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { theme } from '../../theme';

import { Scene1_Hook, DURATION as D1 } from './scenes/Scene1_Hook';
import { Scene2_Shannon, DURATION as D2 } from './scenes/Scene2_Shannon';
import { Scene3_Syllogism, DURATION as D3 } from './scenes/Scene3_Syllogism';
import { Scene4_Closure, DURATION as D4 } from './scenes/Scene4_Closure';
import { Scene5_Core, DURATION as D5 } from './scenes/Scene5_Core';
import { Scene6_Theorem, DURATION as D6 } from './scenes/Scene6_Theorem';
import { Scene7_Agents, DURATION as D7 } from './scenes/Scene7_Agents';
import { Scene8_Closing, DURATION as D8 } from './scenes/Scene8_Closing';

// 所有 DURATION 是从 public/02a-scenes.json 的 whisper 对齐时间戳推出来的
// 如果重新生成 TTS，需要重跑 bin/find-scene-breaks.mjs 然后更新 Scene*.tsx 的 DURATION
const DURATIONS = [D1, D2, D3, D4, D5, D6, D7, D8];
export const TOTAL_FRAMES = DURATIONS.reduce((a, b) => a + b, 0);

const SCENES = [
  { Component: Scene1_Hook,      duration: D1 },
  { Component: Scene2_Shannon,   duration: D2 },
  { Component: Scene3_Syllogism, duration: D3 },
  { Component: Scene4_Closure,   duration: D4 },
  { Component: Scene5_Core,      duration: D5 },
  { Component: Scene6_Theorem,   duration: D6 },
  { Component: Scene7_Agents,    duration: D7 },
  { Component: Scene8_Closing,   duration: D8 },
];

export const Main: React.FC = () => {
  let offset = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      {/* 整段音频贯穿所有场景 */}
      <Audio src={staticFile('02a-narration.mp3')} />

      {SCENES.map((s, i) => {
        const from = offset;
        offset += s.duration;
        const Comp = s.Component;
        return (
          <Sequence key={i} from={from} durationInFrames={s.duration}>
            <Comp />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
