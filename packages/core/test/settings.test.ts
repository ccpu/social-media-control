import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Settings } from '../src/settings';

// In-memory extension storage.
let stored: Record<string, unknown> = {};
let onChanged: (changes: Record<string, { newValue: unknown }>, area: string) => void;

vi.stubGlobal('chrome', {
  storage: {
    sync: {
      get: async (keys: string[]) =>
        Object.fromEntries(
          keys.filter((key) => key in stored).map((key) => [key, stored[key]]),
        ),
      set: async (items: Record<string, unknown>) => {
        stored = { ...stored, ...items };
      },
    },
    onChanged: {
      addListener: (listener: typeof onChanged) => {
        onChanged = listener;
      },
    },
  },
});

describe('settings', () => {
  beforeEach(() => {
    stored = {};
  });

  it('stores values under the site prefix', async () => {
    const settings = new Settings('instagram');
    await settings.init();

    settings.loopPlayback = false;

    expect(stored).toEqual({ 'instagram.loopPlayback': false });
  });

  it('loads the site value before the value stored without prefix', async () => {
    stored = {
      lastPlaybackVolume: 0.3,
      'instagram.lastPlaybackVolume': 0.6,
      loopPlayback: false,
    };
    const settings = new Settings('instagram');

    await settings.init();

    expect(settings.lastPlaybackVolume).toBe(0.6);
    expect(settings.loopPlayback).toBe(false);
  });

  it('only applies storage changes of its own site', async () => {
    const settings = new Settings('facebook');
    await settings.init();

    onChanged({ 'instagram.advanceOnVideoEnd': { newValue: true } }, 'sync');
    expect(settings.advanceOnVideoEnd).toBe(false);

    onChanged({ 'facebook.advanceOnVideoEnd': { newValue: true } }, 'sync');
    expect(settings.advanceOnVideoEnd).toBe(true);
  });

  it('sets a setting by name', async () => {
    const settings = new Settings('facebook');
    await settings.init();
    const onChange = vi.fn();
    settings.changed.subscribe(onChange);

    settings.set('seekWithMouseWheel', false);

    expect(settings.seekWithMouseWheel).toBe(false);
    expect(onChange).toHaveBeenCalledWith('seekWithMouseWheel');
  });
});
