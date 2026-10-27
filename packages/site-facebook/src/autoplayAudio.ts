import { VideoAutoplayMode } from '@internal/core';
import { facebookSettings } from './settings';

// Starts Facebook videos with audio when autoplay with audio is selected. Facebook always starts videos muted.
export class AutoplayAudio {
  // Videos that were already unmuted once, so a video the user mutes stays muted.
  private readonly handledVideos = new WeakSet<HTMLVideoElement>();

  // Does the site have the browser permission to play audio without user interaction? Checked once.
  private siteAllowsAudio: boolean | undefined;

  // Loads the settings and starts listening for videos starting playback.
  public async init(): Promise<void> {
    await facebookSettings.init();

    // Media events don't bubble, so we listen in the capture phase.
    document.addEventListener('play', this.onPlay, true);
  }

  private onPlay = (ev: Event) => {
    if (facebookSettings.autoplayMode !== VideoAutoplayMode.unmuted) return;

    const videoElement = ev.target;
    if (!(videoElement instanceof HTMLVideoElement)) return;
    if (this.handledVideos.has(videoElement)) return;

    // Unmuting without permission makes the browser pause the video, so it keeps playing muted until it is allowed.
    if (!this.canPlayAudio()) return;

    this.handledVideos.add(videoElement);
    videoElement.muted = false;
  };

  // Audio may play after the user interacted with the page, or anytime when the site has the permission.
  private canPlayAudio(): boolean {
    if (navigator.userActivation?.hasBeenActive) return true;

    this.siteAllowsAudio ??= AutoplayAudio.isAudioContextAllowed();
    return this.siteAllowsAudio;
  }

  // An audio context only starts running when the browser allows audio without user interaction.
  private static isAudioContextAllowed(): boolean {
    if (typeof AudioContext === 'undefined') return false;

    const context = new AudioContext();
    const allowed = context.state === 'running';
    context.close().catch(() => undefined);
    return allowed;
  }
}
