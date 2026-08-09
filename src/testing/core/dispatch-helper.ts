import { QueryHelper } from './query-helper';

export class DispatchHelper {
  constructor(private readonly queries: QueryHelper) {}

  private getNativeElement<E extends HTMLElement = HTMLElement>(
    testId: string,
    host?: HTMLElement | Document
  ): E {
    const el = this.queries.query<E>(testId, host);

    if (!el) {
      throw new Error(
        `[DispatchHelper] Element with testId="${testId}" not found`
      );
    }

    return el;
  }

  click(testId: string, host?: HTMLElement | Document): void {
    const el = this.getNativeElement(testId, host);
    el.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
  }

  input(testId: string, value: string, host?: HTMLElement | Document): void {
    const el = this.getNativeElement<HTMLInputElement>(testId, host);
    el.value = value;
    el.dispatchEvent(
      new InputEvent('input', { bubbles: true, cancelable: true })
    );
  }

  checkboxChange(
    testId: string,
    checked: boolean,
    host?: HTMLElement | Document
  ): void {
    const el = this.getNativeElement<HTMLInputElement>(testId, host);
    el.checked = checked;
    el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  }

  submit(testId: string, host?: HTMLElement | Document): void {
    const el = this.getNativeElement<HTMLFormElement>(testId, host);
    el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  clickAtViewportPoint(x: number, y: number): void {
    document.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      })
    );
  }
}
