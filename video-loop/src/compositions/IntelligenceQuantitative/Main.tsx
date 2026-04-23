import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { theme } from '../../theme';

import { Scene1_Hook, DURATION as D1 } from './scenes/Scene1_Hook';
import { Scene2_Formula, DURATION as D2 } from './scenes/Scene2_Formula';
import { Scene3_Independent, DURATION as D3 } from './scenes/Scene3_Independent';
import { Scene4_Trend, DURATION as D4 } from './scenes/Scene4_Trend';
import { Scene5_Multiplication, DURATION as D5 } from './scenes/Scene5_Multiplication';
import { Scene6_ChineseRoom, DURATION as D6 } from './scenes/Scene6_ChineseRoom';
import { Scene7_Computation, DURATION as D7 } from './scenes/Scene7_Computation';
import { Scene8_Self, DURATION as D8 } from './scenes/Scene8_Self';

// DURATION 来自 public/14-scenes.json（whisper 对齐时间戳）
// 重新生成 TTS 后需重跑 bin/find-scene-breaks.mjs 并更新各 Scene 的 DURATION
const DURATIONS = [D1, D2, D3, D4, D5, D6, D7, D8];
export const TOTAL_FRAMES = DURATIONS.reduce((a, b) => a + b, 0);

const SCENES = [
  { Component: Scene1_Hook,           duration: D1 },
  { Component: Scene2_Formula,        duration: D2 },
  { Component: Scene3_Independent,    duration: D3 },
  { Component: Scene4_Trend,          duration: D4 },
  { Component: Scene5_Multiplication, duration: D5 },
  { Component: Scene6_ChineseRoom,    duration: D6 },
  { Component: Scene7_Computation,    duration: D7 },
  { Component: Scene8_Self,           duration: D8 },
];

export const Main: React.FC = () => {
  let offset = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <Audio src={staticFile('14-narration.mp3')} />

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
