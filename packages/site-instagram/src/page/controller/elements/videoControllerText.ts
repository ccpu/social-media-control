import { VideoControllerElementBase } from './videoControllerElement';

export abstract class VideoControllerText extends VideoControllerElementBase<HTMLDivElement> {
  // Changes the text.
  protected setText(text: string): void {
    if (!this.element) return;
    this.element.textContent = text;
  }

  override onCreate(parentElement: HTMLElement): void {
    this.element = document.createElement('div');
    this.element.classList.add('smc-control-element', 'smc-control-text');
    parentElement.appendChild(this.element);

    this.updateControl();
  }
}
