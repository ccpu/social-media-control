// X content script. Runs in the isolated extension context, so it can read the extension settings directly.
// Adds autoplay with audio, a remembered volume and mouse-wheel seeking on X's own seek bar.

import { SeekBarWheel, VideoAudio } from '@internal/core';
import { xSettings } from './settings';

// X's class names are generated, so the seek bar is found by its label and range.
const seekBar = { labels: ['Seek slider'] };

for (const feature of [new VideoAudio(xSettings), new SeekBarWheel(xSettings, seekBar)]) {
  feature.init().then();
}
