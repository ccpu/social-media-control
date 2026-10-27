import { VideoAutoplayMode } from '@internal/core';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { AutoplayAudio } from '../src/autoplayAudio';
import { facebookSettings } from '../src/settings';

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

// A muted video that starts playing, like Facebook autoplays it.
function playVideo(existingVideo?: HTMLVideoElement): HTMLVideoElement {
  const video = existingVideo ?? document.createElement('video');
  video.muted = true;
  document.body.append(video);
  video.dispatchEvent(new Event('play'));
  return video;
}

describe('autoplayAudio', () => {
  beforeAll(async () => {
    await new AutoplayAudio().init();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
    userInteracted = true;
    facebookSettings.autoplayMode = VideoAutoplayMode.unmuted;
  });

  it('unmutes videos when they start', () => {
    expect(playVideo().muted).toBe(false);
  });

  it('keeps videos muted by default', () => {
    facebookSettings.autoplayMode = VideoAutoplayMode.muted;

    expect(playVideo().muted).toBe(true);
  });

  it('keeps a video muted after the user muted it', () => {
    const video = playVideo();

    expect(playVideo(video).muted).toBe(true);
  });

  it('keeps videos muted while the browser does not allow audio', () => {
    userInteracted = false;
    const video = playVideo();
    expect(video.muted).toBe(true);

    // Unmuted once the user interacted with the page.
    userInteracted = true;
    expect(playVideo(video).muted).toBe(false);
  });
});
