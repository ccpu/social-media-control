// YouTube content script. Runs in the isolated extension context, so it can read the extension settings directly.
// Adds mouse-wheel seeking on YouTube's own seek bar, for videos and Shorts.

import { SeekBarWheel } from '@internal/core';
import { youtubeSettings } from './settings';

// The seek bars of the video player and of Shorts. The Shorts seek bar has a range in percent, not seconds.
const seekBar = { selector: '.ytp-progress-bar, .ytPlayerProgressBarDragContainer' };

new SeekBarWheel(youtubeSettings, seekBar).init().then();
