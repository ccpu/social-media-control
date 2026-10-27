// Seeks videos with the mouse wheel. Shared by the Instagram control bar and the Facebook seek bar.
export class VideoWheelSeek {
  private constructor() {}

  // Seconds to seek per wheel step.
  public static readonly stepSeconds = 2;

  // Seeks the video for a wheel event: scrolling down rewinds, scrolling up skips ahead.
  // Returns whether the video was seeked, so the caller can block page scrolling.
  public static seek(videoElement: HTMLVideoElement, ev: WheelEvent): boolean {
    if (!Number.isFinite(videoElement.duration)) return false;
    if (ev.deltaY === 0) return false;

    const offset = ev.deltaY > 0 ? -this.stepSeconds : this.stepSeconds;
    // eslint-disable-next-line no-param-reassign -- Seeking the given video is the purpose of this helper.
    videoElement.currentTime = Math.min(
      Math.max(videoElement.currentTime + offset, 0),
      videoElement.duration,
    );
    return true;
  }
}
