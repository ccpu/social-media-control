import { Settings, Viewport } from '@internal/core';
import { ReelViewer } from './reelViewer';

// Opens the next Facebook reel when the current one finishes playing.
export class ReelAdvancer {
  // The extension settings.
  private readonly settings = Settings.shared;

  // Loads the settings and starts listening for finished videos.
  public async init(): Promise<void> {
    await this.settings.init();

    // Media events don't bubble, so we listen in the capture phase.
    document.addEventListener('ended', this.onEnded, true);
  }

  // Handles the end-of-playback event of any video on the page.
  private onEnded = (ev: Event) => {
    if (!this.settings.advanceOnVideoEnd) return;
    if (!ReelViewer.isReelPath(location.pathname)) return;

    const videoElement = ev.target;
    if (!(videoElement instanceof HTMLVideoElement)) return;
    if (!Viewport.isVisible(videoElement)) return;

    // Facebook restarts the reel on `ended`. Let it finish before navigating away.
    setTimeout(() => ReelViewer.findNextCardButton(videoElement)?.click());
  };
}
