import { UrlPath } from '@internal/core';

// Knows the layout of the Facebook Reels viewer (www.facebook.com/reel/...).
export class ReelViewer {
  private constructor() {}

  // Accessible names of the button that opens the next reel. Facebook localizes this label.
  private static readonly nextCardLabels = ['Next card'];

  // Returns whether the given url path belongs to the Reels viewer.
  public static isReelPath(pathname: string): boolean {
    return UrlPath.startsWithSegment(pathname, 'reel');
  }

  // Finds the enabled button that opens the reel after the given video.
  public static findNextCardButton(
    videoElement: HTMLVideoElement,
  ): HTMLElement | undefined {
    const buttons = Array.from(
      document.querySelectorAll<HTMLElement>('[role="button"]'),
    ).filter((button) => button.getAttribute('aria-disabled') !== 'true');

    return (
      buttons.find((button) =>
        this.nextCardLabels.includes(button.getAttribute('aria-label') ?? ''),
      ) ?? buttons.find((button) => this.isNextCardArea(button, videoElement))
    );
  }

  // Locale-independent fallback: the next-card button is a tall click area starting at the video's right edge.
  private static isNextCardArea(
    button: HTMLElement,
    videoElement: HTMLVideoElement,
  ): boolean {
    const video = videoElement.getBoundingClientRect();
    const area = button.getBoundingClientRect();
    return (
      video.height > 0 &&
      Math.abs(area.left - video.right) <= 2 &&
      area.height >= video.height * 0.8
    );
  }
}
