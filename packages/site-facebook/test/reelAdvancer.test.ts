import { Settings } from '@internal/core';
import { mockBoundingRect } from '@internal/core/testing';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReelAdvancer } from '../src/reelAdvancer';

// Minimal extension storage so the settings can initialize.
vi.stubGlobal('chrome', {
  storage: {
    sync: { get: async () => ({}), set: async () => undefined },
    onChanged: { addListener: () => undefined },
  },
});

function createReel(): { video: HTMLVideoElement; next: HTMLElement } {
  document.body.innerHTML = '';
  const video = document.createElement('video');
  mockBoundingRect(video, { top: 74, left: 472, width: 456, height: 810 });
  const next = document.createElement('div');
  next.setAttribute('role', 'button');
  next.setAttribute('aria-label', 'Next card');
  document.body.append(video, next);
  return { video, next };
}

async function endVideo(video: HTMLVideoElement) {
  video.dispatchEvent(new Event('ended'));
  await new Promise((resolve) => {
    setTimeout(resolve);
  });
}

describe('reelAdvancer', () => {
  beforeAll(async () => {
    await new ReelAdvancer().init();
  });

  beforeEach(() => {
    Settings.shared.advanceOnVideoEnd = true;
    window.history.pushState({}, '', '/reel/1346514350800865');
  });

  it('opens the next reel when playback ends', async () => {
    const { video, next } = createReel();
    const onClick = vi.fn();
    next.addEventListener('click', onClick);

    await endVideo(video);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the setting is disabled', async () => {
    Settings.shared.advanceOnVideoEnd = false;
    const { video, next } = createReel();
    const onClick = vi.fn();
    next.addEventListener('click', onClick);

    await endVideo(video);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('does nothing outside the Reels viewer', async () => {
    window.history.pushState({}, '', '/watch');
    const { video, next } = createReel();
    const onClick = vi.fn();
    next.addEventListener('click', onClick);

    await endVideo(video);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('does nothing for off-screen videos', async () => {
    const { video, next } = createReel();
    mockBoundingRect(video, { top: -2000, height: 810 });
    const onClick = vi.fn();
    next.addEventListener('click', onClick);

    await endVideo(video);

    expect(onClick).not.toHaveBeenCalled();
  });
});
