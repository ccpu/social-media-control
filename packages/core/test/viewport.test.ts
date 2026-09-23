import { describe, expect, it } from 'vitest';
import { mockBoundingRect } from '../src/testing/mockBoundingRect';
import { Viewport } from '../src/viewport';

function createElement(top: number, height = 100): HTMLElement {
  const element = document.createElement('div');
  document.body.appendChild(element);
  mockBoundingRect(element, { top, height });
  return element;
}

describe('viewport', () => {
  it('isVisible detects elements inside and outside the viewport', () => {
    expect(Viewport.isVisible(createElement(0))).toBe(true);
    expect(Viewport.isVisible(createElement(-100))).toBe(false);
    expect(Viewport.isVisible(createElement(window.innerHeight))).toBe(false);
  });

  it('findNextBelow returns the closest connected element below', () => {
    const current = createElement(100);
    const above = createElement(0);
    const far = createElement(900);
    const near = createElement(500);
    const detached = document.createElement('div');
    mockBoundingRect(detached, { top: 200 });

    expect(
      Viewport.findNextBelow(current, [current, above, undefined, far, detached, near]),
    ).toBe(near);
  });

  it('findNextBelow returns undefined when nothing is below', () => {
    const current = createElement(100);
    expect(Viewport.findNextBelow(current, [createElement(0)])).toBeUndefined();
  });
});
