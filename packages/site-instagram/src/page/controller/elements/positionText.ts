import { Utils } from '@internal/core';
import { VideoControllerText } from './videoControllerText';

export class PositionText extends VideoControllerText {
  override updateControl(): void {
    if (!this.videoElement) return;
    this.setText(
      `${Utils.formatTime(this.videoElement.currentTime)} / ${Utils.formatTime(this.videoElement.duration)}`,
    );
  }

  override onTimeUpdate(): void {
    this.updateControl();
  }
}
