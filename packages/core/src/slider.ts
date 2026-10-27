// Finds the sliders of a site's video player: ARIA sliders, or groups wrapping a range input (Base UI, used by X).
export class Slider {
  private constructor() {}

  // Selector of the slider elements.
  public static readonly selector =
    '[role="slider"], [role="group"]:has(input[type="range"])';

  // Returns the slider containing the given element.
  public static closest(element: Element): HTMLElement | null {
    return element.closest<HTMLElement>(this.selector);
  }

  // Returns the maximum value of the slider, e.g. the video duration for a seek bar or 1 for a volume slider.
  public static max(slider: Element): number {
    const max =
      slider.getAttribute('aria-valuemax') ??
      slider.querySelector<HTMLInputElement>('input[type="range"]')?.max;
    return Number(max);
  }
}
