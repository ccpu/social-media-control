import { VideoWheelSeek } from '@internal/core';
import { facebookSettings } from './settings';

// Seeks the video with the mouse wheel while the pointer is over Facebook's own seek bar.
export class SeekBarWheel {
  // Accessible names of the seek bar. Facebook localizes this label.
  private static readonly seekBarLabels = ['Change Position'];

  // Loads the settings and starts listening for wheel events.
  public async init(): Promise<void> {
    await facebookSettings.init();

    // Not passive, so page scrolling can be blocked while seeking.
    document.addEventListener('wheel', this.onWheel, { capture: true, passive: false });
  }

  private onWheel = (ev: WheelEvent) => {
    if (!facebookSettings.seekWithMouseWheel) return;
    if (!(ev.target instanceof Element)) return;

    const seekBar = ev.target.closest<HTMLElement>('[role="slider"]');
    if (!seekBar) return;

    const videoElement = SeekBarWheel.findVideo(seekBar);
    if (!videoElement || !SeekBarWheel.isSeekBar(seekBar, videoElement)) return;
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

  // The seek bar is told apart from the volume slider by its label, or locale-independently by its range matching the
  // video duration in seconds.
  private static isSeekBar(slider: HTMLElement, videoElement: HTMLVideoElement): boolean {
    if (this.seekBarLabels.includes(slider.getAttribute('aria-label') ?? '')) return true;

    const max = Number(slider.getAttribute('aria-valuemax'));
    return max > 1 && Math.abs(max - videoElement.duration) <= 1;
  }
}
