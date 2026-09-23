import type { VideoPlayer } from '../../videoPlayer';
// Base class for video controller elements like buttons and bars
import type { CustomVideoController } from '../customVideoController';

export abstract class VideoControllerElement {
  // The parent video controller
  private videoController?: CustomVideoController;

  // Shortcut to the video player
  protected get videoPlayer(): VideoPlayer | undefined {
    return this.videoController?.videoPlayer;
  }

  // Shortcut to the video element
  protected get videoElement(): HTMLVideoElement | undefined {
    return this.videoController?.videoElement;
  }

  public constructor(videoController: CustomVideoController) {
    this.videoController = videoController;
  }

  // Creates the controller element
  public create(parentElement: HTMLElement): void {
    this.onCreate(parentElement);
    this.onAfterCreate();
    this.updateControl();
  }

  // Abstract creation method
  protected abstract onCreate(parentElement: HTMLElement): void;

  // Abstract method for after creation
  protected abstract onAfterCreate(): void;

  // Removes the created element again
  public abstract remove(): void;

  // Updates the control element
  protected abstract updateControl(): void;

  // Changes the visibility of the control
  public abstract setVisibility(visible: boolean): void;

  // #region Events

  // Video event hooks. Elements override the ones they react to.
  public onPlay(): void {
    // Not handled by default.
  }

  public onPause(): void {
    // Not handled by default.
  }

  public onTimeUpdate(): void {
    // Not handled by default.
  }

  public onVolumeChange(): void {
    // Not handled by default.
  }

  public onPlaybackSpeedChange(): void {
    // Not handled by default.
  }

  public onFullscreenChange(): void {
    // Not handled by default.
  }

  public onPictureInPictureChange(): void {
    // Not handled by default.
  }

  // #endregion Events
}

export abstract class VideoControllerElementBase<
  TElement extends HTMLElement,
> extends VideoControllerElement {
  protected element?: TElement;

  // Called right after onCreate.
  override onAfterCreate(): void {
    if (!this.element) return;
    this.registerHooks(this.element);
  }

  // Removes the created element again
  public override remove(): void {
    if (!this.element) return;
    this.unregisterHooks(this.element);
    this.element.remove();
  }

  // Changes the visibility of the text.
  public override setVisibility(visible: boolean): void {
    if (!this.element) return;
    this.element.style.display = visible ? 'block' : 'none';
  }

  // #region Hooks

  // Hooks must be defined before creation
  public pointerenter?: (ev: PointerEvent) => void;
  public pointerleave?: (ev: PointerEvent) => void;

  private registerHooks(element: TElement) {
    const { pointerenter } = this;
    if (pointerenter) {
      element.addEventListener('pointerenter', (ev) => pointerenter(ev));
    }

    const { pointerleave } = this;
    if (pointerleave) {
      element.addEventListener('pointerleave', (ev) => pointerleave(ev));
    }
  }

  private unregisterHooks(element: TElement) {
    const { pointerenter } = this;
    if (pointerenter) {
      element.removeEventListener('pointerenter', (ev) => pointerenter(ev));
    }
    const { pointerleave } = this;
    if (pointerleave) {
      element.removeEventListener('pointerleave', (ev) => pointerleave(ev));
    }
  }

  // #endregion Hooks
}
