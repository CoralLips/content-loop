import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { theme } from '../../theme';

import { Act1_Puzzle,  DURATION as D1 } from './scenes/v2/Act1_Puzzle';
import { Act2_Shannon, DURATION as D2 } from './scenes/v2/Act2_Shannon';
import { Act3_Tool,    DURATION as D3 } from './scenes/v2/Act3_Tool';
import { Act4_Reveal,  DURATION as D4 } from './scenes/v2/Act4_Reveal';
import { Act5_Coda,    DURATION as D5 } from './scenes/v2/Act5_Coda';

// v2「谜题切片 × 冷峻书面体」实验分支
// 5 个 Act，非论文章节切分，按谜题张力走。时间戳源：public/02a-v2-scenes.json
const DURATIONS = [D1, D2, D3, D4, D5];
export const TOTAL_FRAMES_V2 = DURATIONS.reduce((a, b) => a + b, 0);

const ACTS = [
  { Component: Act1_Puzzle,  duration: D1 },
  { Component: Act2_Shannon, duration: D2 },
  { Component: Act3_Tool,    duration: D3 },
  { Component: Act4_Reveal,  duration: D4 },
  { Component: Act5_Coda,    duration: D5 },
];

export const MainV2: React.FC = () => {
  let offset = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <Audio src={staticFile('02a-v2-narration.mp3')} />

      {ACTS.map((s, i) => {
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
