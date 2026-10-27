import { describe, expect, it } from 'vitest';
import { VideoWheelSeek } from '../src/videoWheelSeek';

function createVideo(currentTime: number, duration = 10): HTMLVideoElement {
  const video = document.createElement('video');
  Object.defineProperty(video, 'duration', { value: duration });
  video.currentTime = currentTime;
  return video;
}

const wheel = (deltaY: number) => new WheelEvent('wheel', { deltaY });

describe('videoWheelSeek', () => {
  it('skips ahead on wheel up and rewinds on wheel down', () => {
    const video = createVideo(5);

    expect(VideoWheelSeek.seek(video, wheel(-1))).toBe(true);
    expect(video.currentTime).toBe(7);
    expect(VideoWheelSeek.seek(video, wheel(1))).toBe(true);
    expect(video.currentTime).toBe(5);
  });

  it('stays within the video', () => {
    const video = createVideo(9);
    VideoWheelSeek.seek(video, wheel(-1));
    expect(video.currentTime).toBe(10);

    video.currentTime = 1;
    VideoWheelSeek.seek(video, wheel(1));
    expect(video.currentTime).toBe(0);
  });

  it('ignores videos without a known duration and horizontal scrolling', () => {
    expect(VideoWheelSeek.seek(createVideo(0, Number.NaN), wheel(-1))).toBe(false);
    expect(VideoWheelSeek.seek(createVideo(5), wheel(0))).toBe(false);
  });
});
