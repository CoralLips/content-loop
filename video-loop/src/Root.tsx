import { Composition, Audio, staticFile, AbsoluteFill } from 'remotion';
import { theme } from './theme';
import { Main, TOTAL_FRAMES } from './compositions/SemanticRateDistortion/Main';
import { MainV2, TOTAL_FRAMES_V2 } from './compositions/SemanticRateDistortion/MainV2';

import { Scene1_Hook, DURATION as D1 } from './compositions/SemanticRateDistortion/scenes/Scene1_Hook';
import { Scene2_Shannon, DURATION as D2 } from './compositions/SemanticRateDistortion/scenes/Scene2_Shannon';
import { Scene3_Syllogism, DURATION as D3 } from './compositions/SemanticRateDistortion/scenes/Scene3_Syllogism';
import { Scene4_Closure, DURATION as D4 } from './compositions/SemanticRateDistortion/scenes/Scene4_Closure';
import { Scene5_Core, DURATION as D5 } from './compositions/SemanticRateDistortion/scenes/Scene5_Core';
import { Scene6_Theorem, DURATION as D6 } from './compositions/SemanticRateDistortion/scenes/Scene6_Theorem';
import { Scene7_Agents, DURATION as D7 } from './compositions/SemanticRateDistortion/scenes/Scene7_Agents';
import { Scene8_Closing, DURATION as D8 } from './compositions/SemanticRateDistortion/scenes/Scene8_Closing';

import { Act1_Puzzle,  DURATION as D1V2 } from './compositions/SemanticRateDistortion/scenes/v2/Act1_Puzzle';
import { Act2_Shannon, DURATION as D2V2 } from './compositions/SemanticRateDistortion/scenes/v2/Act2_Shannon';
import { Act3_Tool,    DURATION as D3V2 } from './compositions/SemanticRateDistortion/scenes/v2/Act3_Tool';
import { Act4_Reveal,  DURATION as D4V2 } from './compositions/SemanticRateDistortion/scenes/v2/Act4_Reveal';
import { Act5_Coda,    DURATION as D5V2 } from './compositions/SemanticRateDistortion/scenes/v2/Act5_Coda';

// Episode 14 · 智能量化定义
import { Main as Main14, TOTAL_FRAMES as TOTAL_FRAMES_14 } from './compositions/IntelligenceQuantitative/Main';
import { MainV2 as MainV2_14, TOTAL_FRAMES_V2 as TOTAL_FRAMES_V2_14 } from './compositions/IntelligenceQuantitative/MainV2';

import { Scene1_Hook as Int14_Scene1, DURATION as E14D1 } from './compositions/IntelligenceQuantitative/scenes/Scene1_Hook';
import { Scene2_Formula as Int14_Scene2, DURATION as E14D2 } from './compositions/IntelligenceQuantitative/scenes/Scene2_Formula';
import { Scene3_Independent as Int14_Scene3, DURATION as E14D3 } from './compositions/IntelligenceQuantitative/scenes/Scene3_Independent';
import { Scene4_Trend as Int14_Scene4, DURATION as E14D4 } from './compositions/IntelligenceQuantitative/scenes/Scene4_Trend';
import { Scene5_Multiplication as Int14_Scene5, DURATION as E14D5 } from './compositions/IntelligenceQuantitative/scenes/Scene5_Multiplication';
import { Scene6_ChineseRoom as Int14_Scene6, DURATION as E14D6 } from './compositions/IntelligenceQuantitative/scenes/Scene6_ChineseRoom';
import { Scene7_Computation as Int14_Scene7, DURATION as E14D7 } from './compositions/IntelligenceQuantitative/scenes/Scene7_Computation';
import { Scene8_Self as Int14_Scene8, DURATION as E14D8 } from './compositions/IntelligenceQuantitative/scenes/Scene8_Self';

import { Act1_Puzzle as Int14_Act1, DURATION as E14V2D1 } from './compositions/IntelligenceQuantitative/scenes/v2/Act1_Puzzle';
import { Act2_Common as Int14_Act2, DURATION as E14V2D2 } from './compositions/IntelligenceQuantitative/scenes/v2/Act2_Common';
import { Act3_Tool   as Int14_Act3, DURATION as E14V2D3 } from './compositions/IntelligenceQuantitative/scenes/v2/Act3_Tool';
import { Act4_Reveal as Int14_Act4, DURATION as E14V2D4 } from './compositions/IntelligenceQuantitative/scenes/v2/Act4_Reveal';
import { Act5_Coda   as Int14_Act5, DURATION as E14V2D5 } from './compositions/IntelligenceQuantitative/scenes/v2/Act5_Coda';

// 每个 scene 独立 Composition，方便单独预览/渲染。
// Audio 偏移对齐：scene N 在整段 mp3 里的起始秒数（从 public/02a-scenes.json 同步）
const SCENE_OFFSETS_SEC    = [0, 58.06, 107.69, 154.58, 200.22, 266.46, 326.11, 372.82];
// v2: 5 Act 时间戳源自 public/02a-v2-scenes.json
const ACT_OFFSETS_SEC_V2   = [0, 15.6, 36.0, 61.6, 87.2];

// Episode 14 时间戳源自 public/14-scenes.json 与 public/14-v2-scenes.json
const SCENE_OFFSETS_SEC_14    = [0, 7.96, 38.28, 77.60, 113.45, 176.12, 221.92, 285.48];
const ACT_OFFSETS_SEC_14_V2   = [0, 11.27, 32.48, 54.68, 85.81];

const makeScenePreview = (Component: React.FC, offsetSec: number, audio: string) => {
  const C: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <Audio src={staticFile(audio)} startFrom={Math.round(offsetSec * 30)} />
      <Component />
    </AbsoluteFill>
  );
  return C;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* v1 主 composition：7min 完整版（默认） */}
      <Composition
        id="SemanticRateDistortion"
        component={Main}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* v2 主 composition：3min 冷峻书面体极简版（实验） */}
      <Composition
        id="SemanticRateDistortionV2"
        component={MainV2}
        durationInFrames={TOTAL_FRAMES_V2}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* v1 独立 scene 预览 */}
      <Composition id="Scene1-Hook"       component={makeScenePreview(Scene1_Hook,      SCENE_OFFSETS_SEC[0], '02a-narration.mp3')} durationInFrames={D1} fps={30} width={1920} height={1080} />
      <Composition id="Scene2-Shannon"    component={makeScenePreview(Scene2_Shannon,   SCENE_OFFSETS_SEC[1], '02a-narration.mp3')} durationInFrames={D2} fps={30} width={1920} height={1080} />
      <Composition id="Scene3-Syllogism"  component={makeScenePreview(Scene3_Syllogism, SCENE_OFFSETS_SEC[2], '02a-narration.mp3')} durationInFrames={D3} fps={30} width={1920} height={1080} />
      <Composition id="Scene4-Closure"    component={makeScenePreview(Scene4_Closure,   SCENE_OFFSETS_SEC[3], '02a-narration.mp3')} durationInFrames={D4} fps={30} width={1920} height={1080} />
      <Composition id="Scene5-Core"       component={makeScenePreview(Scene5_Core,      SCENE_OFFSETS_SEC[4], '02a-narration.mp3')} durationInFrames={D5} fps={30} width={1920} height={1080} />
      <Composition id="Scene6-Theorem"    component={makeScenePreview(Scene6_Theorem,   SCENE_OFFSETS_SEC[5], '02a-narration.mp3')} durationInFrames={D6} fps={30} width={1920} height={1080} />
      <Composition id="Scene7-Agents"     component={makeScenePreview(Scene7_Agents,    SCENE_OFFSETS_SEC[6], '02a-narration.mp3')} durationInFrames={D7} fps={30} width={1920} height={1080} />
      <Composition id="Scene8-Closing"    component={makeScenePreview(Scene8_Closing,   SCENE_OFFSETS_SEC[7], '02a-narration.mp3')} durationInFrames={D8} fps={30} width={1920} height={1080} />

      {/* v2 Act 独立预览 */}
      <Composition id="V2-Act1-Puzzle"  component={makeScenePreview(Act1_Puzzle,  ACT_OFFSETS_SEC_V2[0], '02a-v2-narration.mp3')} durationInFrames={D1V2} fps={30} width={1920} height={1080} />
      <Composition id="V2-Act2-Shannon" component={makeScenePreview(Act2_Shannon, ACT_OFFSETS_SEC_V2[1], '02a-v2-narration.mp3')} durationInFrames={D2V2} fps={30} width={1920} height={1080} />
      <Composition id="V2-Act3-Tool"    component={makeScenePreview(Act3_Tool,    ACT_OFFSETS_SEC_V2[2], '02a-v2-narration.mp3')} durationInFrames={D3V2} fps={30} width={1920} height={1080} />
      <Composition id="V2-Act4-Reveal"  component={makeScenePreview(Act4_Reveal,  ACT_OFFSETS_SEC_V2[3], '02a-v2-narration.mp3')} durationInFrames={D4V2} fps={30} width={1920} height={1080} />
      <Composition id="V2-Act5-Coda"    component={makeScenePreview(Act5_Coda,    ACT_OFFSETS_SEC_V2[4], '02a-v2-narration.mp3')} durationInFrames={D5V2} fps={30} width={1920} height={1080} />

      {/* ========== Episode 14 · 智能量化定义 ========== */}
      <Composition
        id="IntelligenceQuantitative"
        component={Main14}
        durationInFrames={TOTAL_FRAMES_14}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntelligenceQuantitativeV2"
        component={MainV2_14}
        durationInFrames={TOTAL_FRAMES_V2_14}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Episode 14 v1 scene 预览 */}
      <Composition id="Int14-Scene1-Hook"           component={makeScenePreview(Int14_Scene1, SCENE_OFFSETS_SEC_14[0], '14-narration.mp3')} durationInFrames={E14D1} fps={30} width={1920} height={1080} />
      <Composition id="Int14-Scene2-Formula"        component={makeScenePreview(Int14_Scene2, SCENE_OFFSETS_SEC_14[1], '14-narration.mp3')} durationInFrames={E14D2} fps={30} width={1920} height={1080} />
      <Composition id="Int14-Scene3-Independent"    component={makeScenePreview(Int14_Scene3, SCENE_OFFSETS_SEC_14[2], '14-narration.mp3')} durationInFrames={E14D3} fps={30} width={1920} height={1080} />
      <Composition id="Int14-Scene4-Trend"          component={makeScenePreview(Int14_Scene4, SCENE_OFFSETS_SEC_14[3], '14-narration.mp3')} durationInFrames={E14D4} fps={30} width={1920} height={1080} />
      <Composition id="Int14-Scene5-Multiplication" component={makeScenePreview(Int14_Scene5, SCENE_OFFSETS_SEC_14[4], '14-narration.mp3')} durationInFrames={E14D5} fps={30} width={1920} height={1080} />
      <Composition id="Int14-Scene6-ChineseRoom"    component={makeScenePreview(Int14_Scene6, SCENE_OFFSETS_SEC_14[5], '14-narration.mp3')} durationInFrames={E14D6} fps={30} width={1920} height={1080} />
      <Composition id="Int14-Scene7-Computation"    component={makeScenePreview(Int14_Scene7, SCENE_OFFSETS_SEC_14[6], '14-narration.mp3')} durationInFrames={E14D7} fps={30} width={1920} height={1080} />
      <Composition id="Int14-Scene8-Self"           component={makeScenePreview(Int14_Scene8, SCENE_OFFSETS_SEC_14[7], '14-narration.mp3')} durationInFrames={E14D8} fps={30} width={1920} height={1080} />

      {/* Episode 14 v2 Act 预览 */}
      <Composition id="Int14-V2-Act1-Puzzle" component={makeScenePreview(Int14_Act1, ACT_OFFSETS_SEC_14_V2[0], '14-v2-narration.mp3')} durationInFrames={E14V2D1} fps={30} width={1920} height={1080} />
      <Composition id="Int14-V2-Act2-Common" component={makeScenePreview(Int14_Act2, ACT_OFFSETS_SEC_14_V2[1], '14-v2-narration.mp3')} durationInFrames={E14V2D2} fps={30} width={1920} height={1080} />
      <Composition id="Int14-V2-Act3-Tool"   component={makeScenePreview(Int14_Act3, ACT_OFFSETS_SEC_14_V2[2], '14-v2-narration.mp3')} durationInFrames={E14V2D3} fps={30} width={1920} height={1080} />
      <Composition id="Int14-V2-Act4-Reveal" component={makeScenePreview(Int14_Act4, ACT_OFFSETS_SEC_14_V2[3], '14-v2-narration.mp3')} durationInFrames={E14V2D4} fps={30} width={1920} height={1080} />
      <Composition id="Int14-V2-Act5-Coda"   component={makeScenePreview(Int14_Act5, ACT_OFFSETS_SEC_14_V2[4], '14-v2-narration.mp3')} durationInFrames={E14V2D5} fps={30} width={1920} height={1080} />
    </>
  );
};
