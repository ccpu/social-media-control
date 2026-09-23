import { describe, expect, it } from 'vitest';
import { UrlPath } from '../src/urlPath';

describe('urlPath', () => {
  it.each([
    ['/reels', 'reels', true],
    ['/reels/', 'reels', true],
    ['/reels/C1a2b3c4d5e/', 'reels', true],
    ['/', 'reels', false],
    ['/reel/C1a2b3c4d5e/', 'reels', false],
    ['/reelsx/', 'reels', false],
    ['/user/reels/', 'reels', false],
    ['/reel/1346514350800865', 'reel', true],
    ['/reels/', 'reel', false],
  ])('startsWithSegment(%s, %s) is %s', (pathname, segment, expected) => {
    expect(UrlPath.startsWithSegment(pathname, segment)).toBe(expected);
  });
});
