import { Resources } from '../../../resources';
import { VideoControllerButton } from './videoControllerButton';

export class PlayButton extends VideoControllerButton {
  override updateControl(): void {
    const isPaused = Boolean(this.videoElement?.paused);
    this.setIcon(
      isPaused ? Resources.shared.urls.images.play : Resources.shared.urls.images.pause,
    );
    this.setTitle(
      isPaused
        ? Resources.shared.locales.playTooltip
        : Resources.shared.locales.pauseTooltip,
    );
  }

  override onClick(): void {
    if (!this.videoElement) return;

    // Tell the player that the user stated playback in case auto-playback is disabled.
    if (this.videoPlayer) {
      this.videoPlayer.setUserInteractedWithVideo();
    }

    if (this.videoElement.paused) {
      this.videoElement.play().then();
    } else {
      this.videoElement.pause();
    }
  }

  override onPause(): void {
    this.updateControl();
  }

  override onPlay(): void {
    this.updateControl();
  }
}
