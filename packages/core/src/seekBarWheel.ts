import type { Settings } from './settings';
import { VideoWheelSeek } from './videoWheelSeek';

// How to find the seek bar of a site.
export interface SeekBarMatcher {
  // Selector of the seek bar. Without it, any slider is checked by its label and range.
  selector?: string;

  // Accessible names of the seek bar. Sites localize this label, so the seek bar is also found by its range.
  labels?: string[];
}

// Seeks the video with the mouse wheel while the pointer is over a site's own seek bar.
export class SeekBarWheel {
  // The settings of the site.
  private readonly settings: Settings;

  private readonly seekBar: SeekBarMatcher;

  public constructor(settings: Settings, seekBar: SeekBarMatcher) {
    this.settings = settings;
    this.seekBar = seekBar;
  }

  // Loads the settings and starts listening for wheel events.
  public async init(): Promise<void> {
    await this.settings.init();

    // Not passive, so page scrolling can be blocked while seeking.
    document.addEventListener('wheel', this.onWheel, { capture: true, passive: false });
  }

  private onWheel = (ev: WheelEvent) => {
    if (!this.settings.seekWithMouseWheel) return;
    if (!(ev.target instanceof Element)) return;

    const slider = ev.target.closest<HTMLElement>(
      this.seekBar.selector ?? '[role="slider"]',
    );
    if (!slider) return;

    const videoElement = SeekBarWheel.findVideo(slider);
    if (!videoElement || !this.isSeekBar(slider, videoElement)) return;
    if (!VideoWheelSeek.seek(videoElement, ev)) return;

    ev.preventDefault();
    ev.stopPropagation();
  };

  // Finds the video of the player containing the slider.
  private static findVideo(slider: HTMLElement): HTMLVideoElement | undefined {
    for (let parent = slider.parentElement; parent; parent = parent.parentElement) {
      const videos = parent.querySelectorAll('video');
      if (videos.length === 1) return videos[0];
      if (videos.length > 1) return undefined;
    }
    return undefined;
  }

  // Without a selector, the seek bar is told apart from the volume slider by its label, or locale-independently by its
  // range matching the video duration in seconds.
  private isSeekBar(slider: HTMLElement, videoElement: HTMLVideoElement): boolean {
    if (this.seekBar.selector) return true;
    if (this.seekBar.labels?.includes(slider.getAttribute('aria-label') ?? ''))
      return true;

    const max = Number(slider.getAttribute('aria-valuemax'));
    return max > 1 && Math.abs(max - videoElement.duration) <= 1;
  }
}
