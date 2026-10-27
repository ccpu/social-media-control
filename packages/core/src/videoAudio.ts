import type { Settings } from './settings';
import { Slider } from './slider';
import { VideoAutoplayMode } from './videoAutoplayMode';

// How long after a click or key press a volume change still counts as made by the user.
const userInputMs = 500;

// Sites reset the sound right after playback starts, also when the user clicked play. Changes within this time are
// the site's.
const playResetMs = 200;

// Delay before storing the volume. Dragging the volume slider fires many changes and `storage.sync` limits the number
// of writes per minute.
const storeVolumeDelayMs = 500;

// The last click or key press, to tell the user's volume changes from the site's.
interface UserInput {
  target: Element;
  // Changes until this time count as the user's. A pressed pointer counts until it is released.
  until: number;
}

// Keeps the sound of a site's videos the way the user wants it: the last used volume, and with audio when autoplay with
// audio is selected. Sites like Facebook and X start every video muted and reset the sound whenever playback starts, so
// the user's choice is applied again after every change the site makes on its own.
export class VideoAudio {
  // The settings of the site.
  private readonly settings: Settings;

  // Should videos play with audio? Follows the autoplay setting and the user muting or unmuting a video.
  private wantsAudio = false;

  private userInput: UserInput | undefined;

  // When each video last started playing.
  private readonly playStartTimes = new WeakMap<HTMLVideoElement, number>();

  // Videos playing muted because the browser didn't allow audio yet. Unmuted on the first user interaction.
  private readonly waitingVideos = new Set<HTMLVideoElement>();

  // Does the site have the browser permission to play audio without user interaction? Checked once.
  private siteAllowsAudio: boolean | undefined;

  private storeVolumeTimerId: ReturnType<typeof setTimeout> | undefined;

  public constructor(settings: Settings) {
    this.settings = settings;
  }

  // Loads the settings and starts listening for playback, volume changes and user input.
  public async init(): Promise<void> {
    await this.settings.init();

    this.wantsAudio = this.settings.autoplayMode === VideoAutoplayMode.unmuted;
    this.settings.changed.subscribe((name) => {
      if (name === 'autoplayMode') {
        this.wantsAudio = this.settings.autoplayMode === VideoAutoplayMode.unmuted;
      }
    });

    // Media events don't bubble, so we listen in the capture phase.
    document.addEventListener('play', this.onPlay, true);
    document.addEventListener('volumechange', this.onVolumeChange, true);
    window.addEventListener('pointerdown', this.onUserInput, true);
    window.addEventListener('pointerup', this.onUserInput, true);
    window.addEventListener('keydown', this.onUserInput, true);
  }

  private onPlay = (ev: Event) => {
    const videoElement = ev.target;
    if (!(videoElement instanceof HTMLVideoElement)) return;

    this.playStartTimes.set(videoElement, performance.now());
    this.apply(videoElement);
  };

  private onVolumeChange = (ev: Event) => {
    const videoElement = ev.target;
    if (!(videoElement instanceof HTMLVideoElement)) return;

    const playStartTime = this.playStartTimes.get(videoElement) ?? -Infinity;
    const input = this.userInputOn(videoElement);
    if (!input || performance.now() - playStartTime < playResetMs) {
      // Changed by the site.
      this.apply(videoElement);
      return;
    }

    this.wantsAudio = !videoElement.muted;
    if (VideoAudio.isVolumeSlider(input.target) && videoElement.volume > 0) {
      this.storeVolume(videoElement.volume);
    }
  };

  private onUserInput = (ev: Event) => {
    if (ev.type === 'pointerup') {
      if (this.userInput) this.userInput.until = performance.now() + userInputMs;
    } else if (ev.target instanceof Element) {
      const until =
        ev.type === 'pointerdown' ? Infinity : performance.now() + userInputMs;
      this.userInput = { target: ev.target, until };
    }

    // Any click or key press allows audio for the rest of the page visit. Let the page handle the input first.
    if (this.waitingVideos.size > 0) {
      setTimeout(() => this.applyToWaitingVideos());
    }
  };

  // Applies the wanted volume and audio to the video.
  private apply(videoElement: HTMLVideoElement) {
    const volume = this.settings.lastPlaybackVolume;
    // Nothing stored yet, the site's volume is used.
    if (volume > 0 && videoElement.volume !== volume) {
      // eslint-disable-next-line no-param-reassign -- Applying the sound to the given video is the purpose of this method.
      videoElement.volume = volume;
    }

    if (!this.wantsAudio || !videoElement.muted) return;

    // Unmuting without permission makes the browser pause the video, so it keeps playing muted until it is allowed.
    if (this.canPlayAudio()) {
      // eslint-disable-next-line no-param-reassign -- Applying the sound to the given video is the purpose of this method.
      videoElement.muted = false;
    } else {
      this.waitingVideos.add(videoElement);
    }
  }

  private applyToWaitingVideos() {
    const videos = [...this.waitingVideos];
    this.waitingVideos.clear();
    for (const videoElement of videos) {
      if (videoElement.isConnected && !videoElement.paused) this.apply(videoElement);
    }
  }

  // Returns the recent user input on the player of the given video, if any.
  private userInputOn(videoElement: HTMLVideoElement): UserInput | undefined {
    const input = this.userInput;
    if (!input || performance.now() > input.until) return undefined;

    // The input target is inside the player if the closest ancestor containing the video contains no other video.
    let player = input.target.parentElement;
    while (player && !player.contains(videoElement)) player = player.parentElement;
    return player?.querySelectorAll('video').length === 1 ? input : undefined;
  }

  private storeVolume(volume: number) {
    clearTimeout(this.storeVolumeTimerId);
    this.storeVolumeTimerId = setTimeout(() => {
      this.settings.lastPlaybackVolume = volume;
    }, storeVolumeDelayMs);
  }

  // The volume slider ranges from 0 to 1. The seek bar ranges over the video duration in seconds.
  private static isVolumeSlider(element: Element): boolean {
    const slider = Slider.closest(element);
    return slider !== null && Slider.max(slider) === 1;
  }

  // Audio may play after the user interacted with the page, or anytime when the site has the permission.
  private canPlayAudio(): boolean {
    if (navigator.userActivation?.hasBeenActive) return true;

    this.siteAllowsAudio ??= VideoAudio.isAudioContextAllowed();
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
