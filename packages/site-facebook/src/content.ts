// Facebook content script. Runs in the isolated extension context, so it can read the extension settings directly.
// Adds autoplay with audio, a remembered volume, mouse-wheel seeking on Facebook's own seek bar and auto-scroll to the
// Reels viewer.

import { SeekBarWheel, VideoAudio } from '@internal/core';
import { ReelAdvancer } from './reelAdvancer';
import { facebookSettings } from './settings';

// Facebook's class names are generated, so the seek bar is found by its label and range.
const seekBar = { labels: ['Change Position'] };

for (const feature of [
  new VideoAudio(facebookSettings),
  new SeekBarWheel(facebookSettings, seekBar),
  new ReelAdvancer(),
]) {
  feature.init().then();
}
