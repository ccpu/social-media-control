import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { SeekBarWheel } from '../src/seekBarWheel';
import { Settings } from '../src/settings';

// Minimal extension storage so the settings can initialize.
vi.stubGlobal('chrome', {
  storage: {
    sync: { get: async () => ({}), set: async () => undefined },
    onChanged: { addListener: () => undefined },
  },
});

const settings = new Settings('test');

// A player with a video, a seek bar and a volume slider, like Facebook renders it.
function createPlayer(seekBarLabel = 'Change Position') {
  document.body.innerHTML = '';
  const player = document.createElement('div');
  const video = document.createElement('video');
  Object.defineProperty(video, 'duration', { value: 298 });
  video.currentTime = 100;

  const seekBar = document.createElement('div');
  seekBar.setAttribute('role', 'slider');
  seekBar.setAttribute('aria-label', seekBarLabel);
  seekBar.setAttribute('aria-valuemax', '298');
  const seekBarThumb = document.createElement('div');
  seekBar.append(seekBarThumb);

  const volume = document.createElement('div');
  volume.setAttribute('role', 'slider');
  volume.setAttribute('aria-label', 'Change volume');
  volume.setAttribute('aria-valuemax', '1');

  player.append(video, seekBar, volume);
  document.body.append(player);
  return { video, seekBar, seekBarThumb, volume };
}

function wheel(target: Element, deltaY: number): WheelEvent {
  const ev = new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true });
  target.dispatchEvent(ev);
  return ev;
}

describe('seekBarWheel', () => {
  beforeAll(async () => {
    await new SeekBarWheel(settings, { labels: ['Change Position'] }).init();
  });

  beforeEach(() => {
    settings.seekWithMouseWheel = true;
  });

  it('skips ahead when scrolling up over the seek bar', () => {
    const { video, seekBarThumb } = createPlayer();

    const ev = wheel(seekBarThumb, -100);

    expect(video.currentTime).toBe(102);
    expect(ev.defaultPrevented).toBe(true);
  });

  it('rewinds when scrolling down over the seek bar', () => {
    const { video, seekBar } = createPlayer();

    wheel(seekBar, 100);

    expect(video.currentTime).toBe(98);
  });

  it('finds a localized seek bar by its range', () => {
    const { video, seekBar } = createPlayer('Position ändern');

    wheel(seekBar, -100);

    expect(video.currentTime).toBe(102);
  });

  it('does nothing when disabled', () => {
    const { video, seekBar } = createPlayer();
    settings.seekWithMouseWheel = false;

    const ev = wheel(seekBar, -100);

    expect(video.currentTime).toBe(100);
    expect(ev.defaultPrevented).toBe(false);
  });

  it('ignores the volume slider', () => {
    const { video, volume } = createPlayer();

    const ev = wheel(volume, -100);

    expect(video.currentTime).toBe(100);
    expect(ev.defaultPrevented).toBe(false);
  });
});

describe('seekBarWheel with a selector', () => {
  const selectorSettings = new Settings('selector-test');

  beforeAll(async () => {
    await new SeekBarWheel(selectorSettings, { selector: '.seek-bar' }).init();
  });

  it('seeks on the matching element, whatever its range', () => {
    const { video, seekBar } = createPlayer('Seek slider');
    seekBar.classList.add('seek-bar');
    seekBar.setAttribute('aria-valuemax', '100');

    wheel(seekBar, -100);

    expect(video.currentTime).toBe(102);
  });
});
