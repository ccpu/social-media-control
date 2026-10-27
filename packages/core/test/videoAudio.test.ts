import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Settings } from '../src/settings';
import { VideoAudio } from '../src/videoAudio';
import { VideoAutoplayMode } from '../src/videoAutoplayMode';

const settings = new Settings('test');

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

// A playing video with its volume slider and mute button, like Facebook renders it.
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

// The site starts the video and resets it to muted at full volume.
function sitePlays(video: HTMLVideoElement) {
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
    await new VideoAudio(settings).init();
  });

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
    document.body.innerHTML = '';
    userInteracted = true;
    settings.lastPlaybackVolume = 0;
    // Starts every test with the audio wanted by the setting.
    settings.autoplayMode = VideoAutoplayMode.muted;
    settings.autoplayMode = VideoAutoplayMode.unmuted;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('plays with audio when autoplay with audio is selected', () => {
    const { video } = createPlayer();

    sitePlays(video);

    expect(video.muted).toBe(false);
  });

  it('keeps the site muted by default', () => {
    settings.autoplayMode = VideoAutoplayMode.muted;
    const { video } = createPlayer();

    sitePlays(video);

    expect(video.muted).toBe(true);
  });

  it('applies the remembered volume again after the site resets it', () => {
    settings.lastPlaybackVolume = 0.4;
    const { video } = createPlayer();

    sitePlays(video);

    expect(video.volume).toBe(0.4);
  });

  it('remembers the volume set with the volume slider', () => {
    const { video, volumeSlider } = createPlayer();
    sitePlays(video);

    userChanges(volumeSlider, video, { volume: 0.3 });
    sitePlays(video);

    expect(settings.lastPlaybackVolume).toBe(0.3);
    expect(video.volume).toBe(0.3);
  });

  it('keeps the audio the user chose', () => {
    const { video, muteButton } = createPlayer();
    sitePlays(video);

    userChanges(muteButton, video, { muted: true });
    sitePlays(video);
    expect(video.muted).toBe(true);

    userChanges(muteButton, video, { muted: false });
    sitePlays(video);
    expect(video.muted).toBe(false);
  });

  it('takes the reset after the user clicked play as change of the site', () => {
    const { video, muteButton } = createPlayer();

    muteButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    sitePlays(video);

    expect(video.muted).toBe(false);
  });

  it('unmutes on the first user interaction when the browser did not allow audio yet', () => {
    userInteracted = false;
    const { video } = createPlayer();
    sitePlays(video);
    expect(video.muted).toBe(true);

    userInteracted = true;
    window.dispatchEvent(new Event('pointerup'));
    vi.runAllTimers();

    expect(video.muted).toBe(false);
  });
});
