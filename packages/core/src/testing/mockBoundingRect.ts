// Test helper: JSDOM has no layout, so element positions must be faked.
export function mockBoundingRect(
  element: Element,
  rect: { top?: number; left?: number; width?: number; height?: number },
): void {
  const { top = 0, left = 0, width = 0, height = 0 } = rect;
  const getBoundingClientRect = (): DOMRect =>
    ({
      top,
      left,
      width,
      height,
      x: left,
      y: top,
      right: left + width,
      bottom: top + height,
      toJSON: () => ({}),
    }) as DOMRect;
  Object.defineProperty(element, 'getBoundingClientRect', {
    value: getBoundingClientRect,
    configurable: true,
  });
}
