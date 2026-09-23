import { Resources } from '../../../resources';
import { VideoControllerButton } from './videoControllerButton';

export class FullscreenButton extends VideoControllerButton {
  override updateControl(): void {
    const isFullscreen = Boolean(document.fullscreenElement);
    this.setIcon(
      isFullscreen
        ? Resources.shared.urls.images.fullscreenExit
        : Resources.shared.urls.images.fullscreenEnter,
    );
    this.setTitle(
      isFullscreen
        ? Resources.shared.locales.leaveFullscreenTooltip
        : Resources.shared.locales.enterFullscreenTooltip,
    );
  }

  override onClick(): void {
    const videoRootElement = this.videoPlayer?.videoRootElementRef?.deref();
    if (!videoRootElement) return;

    // Toggle fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().then();
    } else {
      videoRootElement.requestFullscreen().then();
    }
  }

  override onPictureInPictureChange(): void {
    this.updateControl();
  }
}
