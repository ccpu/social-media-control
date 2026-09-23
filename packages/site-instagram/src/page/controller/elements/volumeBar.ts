import { VideoControllerSlider } from './videoControllerSlider';

export class VolumeBar extends VideoControllerSlider {
  override onCreate(parentElement: HTMLElement): void {
    super.onCreate(parentElement);

    this.invokeOnDrag = true;

    if (!this.element) return;
    this.element.classList.add('smc-volume-bar');
  }

  override updateControl(): void {
    if (!this.videoElement) return;
    this.setValue(this.videoElement.volume);
  }

  override onValueChange(value: number): void {
    if (!this.videoElement) return;
    this.videoElement.volume = value;
    this.videoElement.muted = this.videoElement.volume <= 0;
  }

  override onVolumeChange(): void {
    this.updateControl();
  }
}
