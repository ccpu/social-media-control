// Facebook content script. Runs in the isolated extension context, so it can read the extension settings directly.
// Adds autoplay with audio, mouse-wheel seeking on Facebook's own seek bar and auto-scroll to the Reels viewer.

import { AutoplayAudio } from './autoplayAudio';
import { ReelAdvancer } from './reelAdvancer';
import { SeekBarWheel } from './seekBarWheel';

for (const feature of [new AutoplayAudio(), new SeekBarWheel(), new ReelAdvancer()]) {
  feature.init().then();
}
