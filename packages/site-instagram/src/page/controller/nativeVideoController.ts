import { VideoController } from './videoController';

// The native browser video controller.
export class NativeVideoController extends VideoController {
  // #region Control

  public create(): void {
    // The controls in Chrome are higher than in Firefox.
    const controlHeight = window.chrome ? 70 : 40;

    this.createVideoControlBackground();
    this.adjustVideoControlHeight(controlHeight);
    this.updateControlBarVisibility();

    // Re-enable pointer events on the video element
    if (this.videoElement) {
      this.videoElement.style.pointerEvents = 'all';
    }
  }

  public remove(): void {
    super.remove();

    if (this.videoElement) {
      this.videoElement.style.pointerEvents = '';
    }
  }

  // #endregion Control

  // #region Events

  public override onPlay(): void {
    // The native controls handle this themselves.
  }

  public override onPause(): void {
    // The native controls handle this themselves.
  }

  public override onTimeUpdate(): void {
    // The native controls handle this themselves.
  }

  public override onVolumeChange(): void {
    // The native controls handle this themselves.
  }

  public override onPlaybackSpeedChange(): void {
    // The native controls handle this themselves.
  }

  public override onFullscreenChange(): void {
    // The native controls handle this themselves.
  }

  public override onPictureInPictureChange(): void {
    // The native controls handle this themselves.
  }

  public onUpdateSettings(): void {
    this.updateControlBarVisibility();
  }

  protected setVisibility(visibility: boolean): void {
    if (!this.videoElement) return;
    this.videoElement.controls = visibility;
  }

  // #endregion Events
}
