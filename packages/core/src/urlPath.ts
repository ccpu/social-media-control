// Url path helpers shared by the Instagram and Facebook scripts.
export class UrlPath {
  private constructor() {}

  // Returns whether the path starts with the given segment, e.g. `/reels/abc/` with `reels`.
  public static startsWithSegment(pathname: string, segment: string): boolean {
    return pathname === `/${segment}` || pathname.startsWith(`/${segment}/`);
  }
}
