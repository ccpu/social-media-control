import { mockBoundingRect } from '@internal/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReelViewer } from '../src/reelViewer';

function createButton(label?: string): HTMLElement {
  const button = document.createElement('div');
  button.setAttribute('role', 'button');
  if (label) button.setAttribute('aria-label', label);
  document.body.appendChild(button);
  return button;
}

function createVideo(): HTMLVideoElement {
  const video = document.createElement('video');
  document.body.appendChild(video);
  mockBoundingRect(video, { top: 74, left: 472, width: 456, height: 810 });
  return video;
}

describe('reelViewer', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it.each([
    ['/reel/1346514350800865', true],
    ['/reel/', true],
    ['/reel', true],
    ['/reels', false],
    ['/facebook/reels/', false],
    ['/watch', false],
  ])('isReelPath(%s) is %s', (pathname, expected) => {
    expect(ReelViewer.isReelPath(pathname)).toBe(expected);
  });

  it('finds the next-card button by its label', () => {
    const video = createVideo();
    createButton('Previous card');
    const next = createButton('Next card');

    expect(ReelViewer.findNextCardButton(video)).toBe(next);
  });

  it('ignores a disabled next-card button', () => {
    const video = createVideo();
    createButton('Next card').setAttribute('aria-disabled', 'true');

    expect(ReelViewer.findNextCardButton(video)).toBeUndefined();
  });

  it('falls back to the click area right of the video', () => {
    const video = createVideo();
    const previous = createButton('Vorherige Karte');
    mockBoundingRect(previous, {
      top: 56,
      left: -228,
      width: 700,
      height: 846,
    });
    const like = createButton('Gefällt mir');
    mockBoundingRect(like, { top: 800, left: 940, width: 40, height: 40 });
    const next = createButton('Nächste Karte');
    mockBoundingRect(next, { top: 56, left: 928, width: 700, height: 846 });

    expect(ReelViewer.findNextCardButton(video)).toBe(next);
  });

  it('returns undefined without layout or label', () => {
    const video = document.createElement('video');
    document.body.appendChild(video);
    createButton('Something else');

    expect(ReelViewer.findNextCardButton(video)).toBeUndefined();
  });
});
