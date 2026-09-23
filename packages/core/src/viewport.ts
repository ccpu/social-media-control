// Viewport helpers shared by the Instagram and Facebook scripts.
export class Viewport {
  private constructor() {}

  // Returns whether an element is currently within the viewport.
  public static isVisible(element: Element): boolean {
    const position = element.getBoundingClientRect();
    return position.bottom > 0 && position.top < window.innerHeight;
  }

  // Returns the connected candidate that starts closest below the given element.
  public static findNextBelow(
    current: Element,
    candidates: (HTMLElement | undefined)[],
  ): HTMLElement | undefined {
    const currentTop = current.getBoundingClientRect().top;
    return candidates
      .filter(
        (element): element is HTMLElement =>
          element !== undefined &&
          element !== current &&
          element.isConnected &&
          element.getBoundingClientRect().top > currentTop + 1,
      )
      .sort(
        (first, second) =>
          first.getBoundingClientRect().top - second.getBoundingClientRect().top,
      )[0];
  }
}
