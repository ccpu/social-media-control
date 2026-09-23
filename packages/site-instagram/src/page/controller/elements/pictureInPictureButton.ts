import { Resources } from '../../../resources';
import { VideoControllerButton } from './videoControllerButton';

export class PictureInPictureButton extends VideoControllerButton {
  override updateControl(): void {
    const isPictureInPicture = Boolean(document.pictureInPictureElement);
    this.setIcon(
      isPictureInPicture
        ? Resources.shared.urls.images.pictureInPictureExit
        : Resources.shared.urls.images.pictureInPictureEnter,
    );
    this.setTitle(
      isPictureInPicture
        ? Resources.shared.locales.leavePictureInPictureTooltip
        : Resources.shared.locales.enterPictureInPictureTooltip,
    );
  }

  override onClick(): void {
    if (!this.videoElement) return;

    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().then();
    } else {
      this.videoElement.requestPictureInPicture().then();
    }
  }

  override onPictureInPictureChange(): void {
    this.updateControl();
  }
}
