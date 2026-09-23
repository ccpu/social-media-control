import type { VideoControllerElement } from './elements/videoControllerElement';
import { Settings } from '@internal/core';
import { DownloadButton } from './elements/downloadButton';
import { FullscreenButton } from './elements/fullscreenButton';
import { MuteButton } from './elements/muteButton';
import { PictureInPictureButton } from './elements/pictureInPictureButton';
import { PlaybackSpeedButton } from './elements/playbackSpeedButton';
import { PlayButton } from './elements/playButton';
import { PositionText } from './elements/positionText';
import { SeekBar } from './elements/seekBar';
import { VolumeBar } from './elements/volumeBar';
import { VideoController } from './videoController';

// The custom video controller.
export class CustomVideoController extends VideoController {
  // #region Control

  // The parent element for the control items.
  private controlElement: HTMLElement | undefined;

  // The control elements.
  private controls: VideoControllerElement[] = [];

  /**
   * Create the video controls.
   */
  public create(): void {
    const { videoElement } = this;
    if (!videoElement) return;

    const controlHeight = 32;

    this.createVideoControlBackground();
    this.adjustVideoControlHeight(controlHeight);

    // Creating the actual player...
    if (!this.videoControlElement) return;

    this.controlElement = document.createElement('div');
    this.controlElement.classList.add('smc-controls-content');
    this.videoControlElement.appendChild(this.controlElement);

    this.rebuildControlElements();

    // Init update
    this.updateControlBarVisibility();
  }

  /**
   * Recreates the control elements.
   */
  private rebuildControlElements() {
    if (!this.controlElement) return;

    // Remove previous controls
    for (const control of this.controls) {
      control.remove();
    }

    this.controls = this.getActiveControlElements();

    // Create the control elements
    for (const control of this.controls) {
      control.create(this.controlElement);
    }
  }

  /**
   * Build the list of controls to spawn in the UI from the settings.
   */
  private getActiveControlElements(): VideoControllerElement[] {
    const settings = Settings.shared;
    const controls = [];

    controls.push(new PlayButton(this));

    // Create a mute and volume bar and make the volume bar collapse when not hovered.
    const mudeButton = new MuteButton(this);
    const volumeBar = new VolumeBar(this);
    volumeBar.setCollapsed(true);
    // Handle hover events
    const expandVolumeBar = (): void => volumeBar.setCollapsed(false);
    const collapseVolumeBar = (): void => volumeBar.setCollapsed(true);
    mudeButton.pointerenter = expandVolumeBar;
    volumeBar.pointerenter = expandVolumeBar;
    mudeButton.pointerleave = collapseVolumeBar;
    volumeBar.pointerleave = collapseVolumeBar;

    controls.push(mudeButton);
    controls.push(volumeBar);

    if (settings.showTimeCodeText) {
      controls.push(new PositionText(this));
    }
    controls.push(new SeekBar(this));
    if (settings.showPlaybackSpeedOption) {
      controls.push(new PlaybackSpeedButton(this));
    }
    if (document.pictureInPictureEnabled && settings.showPictureInPictureButton) {
      controls.push(new PictureInPictureButton(this));
    }
    if (settings.showDownloadButton) {
      controls.push(new DownloadButton(this));
    }
    if (document.fullscreenEnabled && settings.showFullscreenButton) {
      controls.push(new FullscreenButton(this));
    }

    return controls;
  }

  // #endregion Control

  // #region Events

  public override onPlay(): void {
    for (const control of this.controls) {
      control.onPlay();
    }
  }

  public override onPause(): void {
    for (const control of this.controls) {
      control.onPause();
    }
  }

  public override onTimeUpdate(): void {
    for (const control of this.controls) {
      control.onTimeUpdate();
    }
  }

  public override onVolumeChange(): void {
    for (const control of this.controls) {
      control.onVolumeChange();
    }
  }

  public override onPlaybackSpeedChange(): void {
    for (const control of this.controls) {
      control.onPlaybackSpeedChange();
    }
  }

  public override onFullscreenChange(): void {
    for (const control of this.controls) {
      control.onFullscreenChange();
    }
  }

  public override onPictureInPictureChange(): void {
    for (const control of this.controls) {
      control.onPictureInPictureChange();
    }
  }

  public onUpdateSettings(): void {
    this.rebuildControlElements();
    this.updateControlBarVisibility();
  }

  // #endregion Events

  // #region Update

  protected setVisibility(visibility: boolean): void {
    if (!this.videoControlElement) return;
    this.videoControlElement.classList.toggle('hidden', !visibility);
  }

  // #endregion Update
}
