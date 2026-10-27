import { VideoAutoplayMode } from '@internal/core';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { facebookSettings } from '../src/settings';
import { VideoAudio } from '../src/videoAudio';

// Minimal extension storage so the settings can initialize.
vi.stubGlobal('chrome', {
  storage: {
    sync: { get: async () => ({}), set: async () => undefined },
    onChanged: { addListener: () => undefined },
  },
});

// Whether the user interacted with the page, which allows audio.
let userInteracted = true;
Object.defineProperty(navigator, 'userActivation', {
  get: () => ({ hasBeenActive: userInteracted }),
});

// Without user interaction, audio only plays with the site permission. This test site has none.
vi.stubGlobal(
  'AudioContext',
  class {
    public state = 'suspended';
    public close = async () => undefined;
  },
);

// A playing Facebook video with its volume slider and mute button.
function createPlayer() {
  const player = document.createElement('div');
  const video = document.createElement('video');
  Object.defineProperty(video, 'paused', { value: false });
  const volumeSlider = document.createElement('div');
  volumeSlider.setAttribute('role', 'slider');
  volumeSlider.setAttribute('aria-valuemax', '1');
  const muteButton = document.createElement('div');
  player.append(video, volumeSlider, muteButton);
  document.body.append(player);
  return { video, volumeSlider, muteButton };
}

// Facebook starts the video and resets it to muted at full volume.
function facebookPlays(video: HTMLVideoElement) {
  video.dispatchEvent(new Event('play'));
  Object.assign(video, { muted: true, volume: 1 });
  video.dispatchEvent(new Event('volumechange'));
  vi.advanceTimersByTime(1000);
}

// The user changes the sound with the given player element.
function userChanges(
  target: Element,
  video: HTMLVideoElement,
  sound: Partial<HTMLVideoElement>,
) {
  target.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  Object.assign(video, sound);
  video.dispatchEvent(new Event('volumechange'));
  target.dispatchEvent(new Event('pointerup', { bubbles: true }));
  vi.advanceTimersByTime(1000);
}

describe('videoAudio', () => {
  beforeAll(async () => {
    await new VideoAudio().init();
  });

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
    document.body.innerHTML = '';
    userInteracted = true;
    facebookSettings.lastPlaybackVolume = 0;
    // Starts every test with the audio wanted by the setting.
    facebookSettings.autoplayMode = VideoAutoplayMode.muted;
    facebookSettings.autoplayMode = VideoAutoplayMode.unmuted;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('plays with audio when autoplay with audio is selected', () => {
    const { video } = createPlayer();

    facebookPlays(video);

    expect(video.muted).toBe(false);
  });

  it('keeps Facebook muted by default', () => {
    facebookSettings.autoplayMode = VideoAutoplayMode.muted;
    const { video } = createPlayer();

    facebookPlays(video);

    expect(video.muted).toBe(true);
  });

  it('applies the remembered volume again after Facebook resets it', () => {
    facebookSettings.lastPlaybackVolume = 0.4;
    const { video } = createPlayer();

    facebookPlays(video);

    expect(video.volume).toBe(0.4);
  });

  it('remembers the volume set with the volume slider', () => {
    const { video, volumeSlider } = createPlayer();
    facebookPlays(video);

    userChanges(volumeSlider, video, { volume: 0.3 });
    facebookPlays(video);

    expect(facebookSettings.lastPlaybackVolume).toBe(0.3);
    expect(video.volume).toBe(0.3);
  });

  it('keeps the audio the user chose', () => {
    const { video, muteButton } = createPlayer();
    facebookPlays(video);

    userChanges(muteButton, video, { muted: true });
    facebookPlays(video);
    expect(video.muted).toBe(true);

    userChanges(muteButton, video, { muted: false });
    facebookPlays(video);
    expect(video.muted).toBe(false);
  });

  it('takes the reset after the user clicked play as Facebook change', () => {
    const { video, muteButton } = createPlayer();

    muteButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    facebookPlays(video);

    expect(video.muted).toBe(false);
  });

  it('unmutes on the first user interaction when the browser did not allow audio yet', () => {
    userInteracted = false;
    const { video } = createPlayer();
    facebookPlays(video);
    expect(video.muted).toBe(true);

    userInteracted = true;
    window.dispatchEvent(new Event('pointerup'));
    vi.runAllTimers();

    expect(video.muted).toBe(false);
  });
});
