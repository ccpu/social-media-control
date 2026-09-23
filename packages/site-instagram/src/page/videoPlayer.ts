import type { ReactFiber } from '@internal/react-fiber';
import type { VideoController } from './controller/videoController';
import type { PlaybackManager } from './playbackManager';
import { Settings, UrlPath, VideoAutoplayMode, VideoControlMode } from '@internal/core';
import { ReactHelper } from '@internal/react-fiber';
import { CustomVideoController } from './controller/customVideoController';
import { NativeVideoController } from './controller/nativeVideoController';
import { VideoType } from './videoType';

// The custom video player for Instagram video tags.
export class VideoPlayer {
  // The playback manager to report events to.
  public readonly playbackManager: PlaybackManager;

  // Has the user already interacted with the video player?
  private userInteractedWithVideo: boolean = false;

  // Has this playback completed and already triggered an advance?
  private advancedAfterVideoEnd: boolean = false;

  public constructor(playbackManager: PlaybackManager) {
    this.playbackManager = playbackManager;
  }

  // Attaches to the video player and adds custom element and events.
  public attach(): void {
    this.createVideoControl();

    this.registerEvents();

    this.initHover();

    this.checkAutoplay();
    this.updateLoopSetting();
  }

  // Detaches the custom player from the video tag. Removes all custom element and events.
  public detach(): void {
    this.unregisterEvents();

    this.removeVideoControl();
  }

  // #region Events

  // Register all video events.
  private registerEvents() {
    const videoElement = this.videoElementRef?.deref();
    if (!videoElement) return;
    const videoRootElement = this.videoRootElementRef?.deref();
    const nativeControlsElement = this.nativeControlsElementRef?.deref();

    videoElement.addEventListener('play', this.onPlay);
    videoElement.addEventListener('pause', this.onPause);
    videoElement.addEventListener('ended', this.onEnded);
    videoElement.addEventListener('timeupdate', this.onTimeUpdate);
    videoElement.addEventListener('volumechange', this.onVolumeChange);
    videoElement.addEventListener('ratechange', this.onPlaybackSpeedChange);
    document.addEventListener('fullscreenchange', this.onFullscreenChange);
    videoElement.addEventListener('enterpictureinpicture', this.onPictureInPictureChange);
    videoElement.addEventListener('leavepictureinpicture', this.onPictureInPictureChange);
    videoRootElement?.addEventListener('mouseenter', this.onMouseEnter);
    videoRootElement?.addEventListener('mouseleave', this.onMouseLeave);
    videoRootElement?.addEventListener('mousemove', this.onMouseMove);
    videoRootElement?.addEventListener('wheel', this.onMouseWheel, {
      passive: false,
    });
    nativeControlsElement?.addEventListener('click', this.onNativeControlClick);
  }

  // Unregisters all video events.
  private unregisterEvents() {
    const videoElement = this.videoElementRef?.deref();
    if (!videoElement) return;
    const videoRootElement = this.videoRootElementRef?.deref();
    const nativeControlsElement = this.nativeControlsElementRef?.deref();

    videoElement.removeEventListener('play', this.onPlay);
    videoElement.removeEventListener('pause', this.onPause);
    videoElement.removeEventListener('ended', this.onEnded);
    videoElement.removeEventListener('timeupdate', this.onTimeUpdate);
    videoElement.removeEventListener('volumechange', this.onVolumeChange);
    videoElement.removeEventListener('ratechange', this.onPlaybackSpeedChange);
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    videoElement.removeEventListener(
      'enterpictureinpicture',
      this.onPictureInPictureChange,
    );
    videoElement.removeEventListener(
      'leavepictureinpicture',
      this.onPictureInPictureChange,
    );
    videoRootElement?.removeEventListener('mouseenter', this.onMouseEnter);
    videoRootElement?.removeEventListener('mouseleave', this.onMouseLeave);
    videoRootElement?.removeEventListener('mousemove', this.onMouseMove);
    videoRootElement?.removeEventListener('wheel', this.onMouseWheel);
    nativeControlsElement?.removeEventListener('click', this.onNativeControlClick);
  }

  // Handles video play event.
  private onPlay = () => {
    this.advancedAfterVideoEnd = false;

    // The page may have changed since attaching (e.g. feed -> Reels), which changes the loop behavior.
    this.updateLoopSetting();

    this.videoController?.onPlay();

    this.playbackManager.notifyVideoPlay(this);

    this.checkAutoplay();
  };

  // Handles video pause event.
  private onPause = () => {
    this.videoController?.onPause();

    // If not registered, the site will show a 'you need to log in to replay' banner.
    // This makes sure it is removed, so you regain control.
    setTimeout(() => {
      // this.removeNotRegisteredOverlayElement();
    });
  };

  // Handles video end-of-playback event.
  private onEnded = () => {
    const videoElement = this.videoElementRef?.deref();
    if (!videoElement) return;

    // Instagram handles the re-start on loops manually and ignores the `loop` property. We simply pause again.
    if (!videoElement.loop) {
      videoElement.pause();
    }

    if (this.shouldAdvanceOnVideoEnd() && !this.advancedAfterVideoEnd) {
      this.advancedAfterVideoEnd = true;
      this.playbackManager.advanceToNextVideo(this);
    }
  };

  // Handles video time update event.
  private onTimeUpdate = () => {
    this.videoController?.onTimeUpdate();
  };

  // Handles video volume changes.
  private onVolumeChange = () => {
    this.videoController?.onVolumeChange();

    // We don't want to react to volume changes from the page itself.
    // if (!event.isTrusted) return;

    this.playbackManager.notifyVideoVolumeChange(this);
  };

  // Handles video playback speed changes.
  private onPlaybackSpeedChange = () => {
    this.videoController?.onPlaybackSpeedChange();

    this.playbackManager.notifyVideoPlaybackSpeedChange(this);
  };

  // Handles fullscreen changes.
  private onFullscreenChange = () => {
    this.videoController?.onFullscreenChange();
  };

  // Handles Picture-in-Picture changes.
  private onPictureInPictureChange = () => {
    this.videoController?.onPictureInPictureChange();
  };

  // Mouse enters the player element.
  private onMouseEnter = () => {
    this.videoController?.setHover(true);
  };

  // Mouse leaves the player element.
  private onMouseLeave = () => {
    this.videoController?.setHover(false);
  };

  // Mouse moves over the player element.
  private onMouseMove = (ev: MouseEvent) => {
    const videoElement = this.videoElementRef?.deref();
    if (!videoElement) return;

    // There is no way to detect clicks to the native video controller, but we need to know when the user interacted
    // with the playback control to allow user-playback when auto-playback is disabled.
    // While mouse click events are blocked, mouse move events still fire. This isn't the best solution, but it
    // resolves the issue where the user wasn't able to start playback from native controls if autoplay is disabled.
    if (ev.target === videoElement) {
      this.setUserInteractedWithVideo();
    }
  };

  // Seeks the video when the mouse wheel is used on the custom control bar.
  private onMouseWheel = (ev: WheelEvent) => {
    if (!this.isPointerOverCustomControls(ev.target)) return;

    const videoElement = this.videoElementRef?.deref();
    if (!videoElement || !Number.isFinite(videoElement.duration)) return;
    if (ev.deltaY === 0) return;

    ev.preventDefault();
    ev.stopPropagation();

    const seekOffset = ev.deltaY > 0 ? -2 : 2;
    videoElement.currentTime = Math.min(
      Math.max(videoElement.currentTime + seekOffset, 0),
      videoElement.duration,
    );
  };

  // Returns whether an event target belongs to the extension's custom controls.
  private isPointerOverCustomControls(target: EventTarget | null): boolean {
    return target instanceof Element && target.closest('.smc-controls-content') !== null;
  }

  // Mouse clicked the native player element
  private onNativeControlClick = () => {
    if (this.userInteractedWithVideo) return;
    this.userInteractedWithVideo = true;

    const videoElement = this.videoElementRef?.deref();
    if (!videoElement) return;

    // There is an issue with stopped playback and the Reel player. Instagram assumes that playback autostarts and
    // that the big play button is invisible on load.
    // On stopped playback the video is paused and need player interaction to start. The first click toggles video
    // playback and because Instagram assumes the video is already playing the video is stopped and the big play
    // button is shown again. A second click is required to start playback.
    // The following code bypasses the second click on the first interaction by just starting the video again.
    // This will make the play button quickly pop-in and pop-out, but it's the best we can do to make it seamless.
    if (videoElement.paused) {
      setTimeout(() => {
        videoElement.play().then();
      });
    }
  };

  // #endregion

  // #region Video

  // The video origin.
  public videoType: VideoType = VideoType.post;

  // The React fiber of the video player - called Polaris.
  public polarisFiber: ReactFiber | undefined;

  // The HTML video element to play.
  public videoElementRef: WeakRef<HTMLVideoElement> | undefined;

  // The uppermost root element of the whole player.
  public videoRootElementRef: WeakRef<HTMLElement> | undefined;

  // The root player element for Stories.
  public storyMediaPlayerElementRef: WeakRef<HTMLElement> | undefined;

  // The footer element (comments for stories).
  public storyFooterElementRef: WeakRef<HTMLElement> | undefined;

  // The mute button and volume slider.
  public nativeVolumeControlElementRef: WeakRef<HTMLElement> | undefined;

  // The area containing the clip author and description.
  public nativeOverlayElementRef: WeakRef<HTMLElement> | undefined;

  public nativeControlsElementRef: WeakRef<HTMLElement> | undefined;

  // Detects the video type and finds all native components.
  public tryDetect(polarisFiber: ReactFiber, videoElement: HTMLVideoElement): boolean {
    const polarisNode = ReactHelper.getNodeFromFiber(polarisFiber);
    if (!polarisNode) return false;

    this.polarisFiber = polarisFiber;
    this.videoRootElementRef = new WeakRef(polarisNode);
    this.videoElementRef = new WeakRef(videoElement);

    // Find optional elements

    // Native mute button and volume slider
    const volumeControlFiber = ReactHelper.getChildByName(
      polarisFiber,
      'PolarisMediaVideoPlayerAudioToggle',
      'PolarisPostVideoPlayerControls',
    );
    const volumeControlElement = ReactHelper.getNodeFromFiber(volumeControlFiber);
    this.nativeVolumeControlElementRef = volumeControlElement
      ? new WeakRef(volumeControlElement)
      : undefined;

    const overlayFiber = ReactHelper.getChildByName(
      polarisFiber,
      'VideoPlayerInteractionOverlay',
    );
    const overlayElement = ReactHelper.getNodeFromFiber(overlayFiber);
    this.nativeOverlayElementRef = overlayElement
      ? new WeakRef(overlayElement)
      : undefined;

    // Finds the root Story player.
    const storyPlayerFiber = ReactHelper.getParentByName(
      polarisFiber,
      'PolarisStoriesV3Player',
    );

    // Then find the Story media player.
    // This has a small mouse-blocking element at the bottom, preventing clicks to the controls.
    const storyMediaPlayerFiber = ReactHelper.getChildByName(
      storyPlayerFiber,
      'PolarisStoriesV3MediaPlayer',
    );
    const storyMediaPlayerElement = ReactHelper.getNodeFromFiber(storyMediaPlayerFiber);
    this.storyMediaPlayerElementRef = storyMediaPlayerElement
      ? new WeakRef(storyMediaPlayerElement)
      : undefined;

    // Find the Stories footer (comments, etc.).
    const storyFooterFiber = ReactHelper.getChildByName(
      storyPlayerFiber,
      'PolarisStoriesV3ReelFooter',
      'PolarisStoriesV3Footer',
    );
    const storyFooterElement = ReactHelper.getNodeFromFiber(storyFooterFiber);
    this.storyFooterElementRef = storyFooterElement
      ? new WeakRef(storyFooterElement)
      : undefined;

    // Currently the best way to detect Reels
    const postVideoPlayer = ReactHelper.getParentByName(
      polarisFiber,
      'PolarisPostMediaVideoPlayer',
      'PolarisPostVideoPlayer',
    );
    if (storyFooterElement) {
      this.videoType = VideoType.story;
    } else if (postVideoPlayer) {
      this.videoType = VideoType.post;
    } else {
      this.videoType = VideoType.reel;
    }

    return true;
  }

  // #endregion

  // #region Controls

  // The current created controller.
  private videoController: VideoController | undefined;

  /**
   * Sets the flag that the user has interacted with the video.
   * This allows playback if autoplay is disabled.
   */
  public setUserInteractedWithVideo(): void {
    this.userInteractedWithVideo = true;
  }

  // Creates the video controls.
  private createVideoControl() {
    switch (Settings.shared.videoControlMode) {
      case VideoControlMode.native:
        this.videoController = new NativeVideoController(this);
        break;
      case VideoControlMode.custom:
        this.videoController = new CustomVideoController(this);
        break;
    }
    this.videoController?.create();
  }

  // Removes the video controls
  private removeVideoControl() {
    if (!this.videoController) return;
    this.videoController.remove();
    this.videoController = undefined;
  }

  // Checks if the mouse already hovers over the video on initialization. Otherwise, the controls would only show up
  // when the mouse exits and enters again.
  private initHover() {
    const videoRootElement = this.videoRootElementRef?.deref();
    if (!videoRootElement) return;
    const hover = videoRootElement.matches(':hover');
    this.videoController?.setHover(hover);
  }

  // Is called when any control setting was changed. We should update all dynamic controls.
  public updateControlSetting(): void {
    this.videoController?.onUpdateSettings();

    this.updateLoopSetting();
  }

  // Is called when the control mode was changed. This rebuilds the UI.
  public updateControlMode(): void {
    this.detach();
    this.attach();
  }

  // Checks the autoplay setting and pauses the video if needed.
  private checkAutoplay() {
    const videoElement = this.videoElementRef?.deref();
    if (!videoElement) return;

    if (
      Settings.shared.autoplayMode === VideoAutoplayMode.stopped &&
      !this.userInteractedWithVideo
    ) {
      videoElement.pause();
      videoElement.currentTime = 0; // Jump back to start
      videoElement.muted = false; // Continue with audio
    }
  }

  // Updates the video's loop property from the settings.
  private updateLoopSetting() {
    const videoElement = this.videoElementRef?.deref();
    if (!videoElement) return;

    videoElement.loop = Settings.shared.loopPlayback && !this.shouldAdvanceOnVideoEnd();
  }

  // Returns whether playback should move to the next video when it ends. Only the Reels page advances.
  private shouldAdvanceOnVideoEnd(): boolean {
    return (
      Settings.shared.advanceOnVideoEnd &&
      UrlPath.startsWithSegment(location.pathname, 'reels')
    );
  }

  // #endregion Controls
}
