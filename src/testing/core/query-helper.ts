type ElementWithValue =
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export class QueryHelper {
  constructor(private readonly container: HTMLElement | Document) {}

  query<E extends HTMLElement = HTMLElement>(
    testId: string,
    host: HTMLElement | Document = this.container
  ): E | null {
    return host.querySelector<E>(`[data-testid="${testId}"]`);
  }

  queryAll<E extends HTMLElement = HTMLElement>(
    testId: string,
    host: HTMLElement | Document = this.container
  ): E[] {
    return Array.from(host.querySelectorAll<E>(`[data-testid="${testId}"]`));
  }

  getTextContent(testId: string, host?: HTMLElement | Document): string | null {
    return this.query(testId, host)?.textContent?.trim() ?? null;
  }

  getValue(testId: string, host?: HTMLElement | Document): string | null {
    return this.query<ElementWithValue>(testId, host)?.value ?? null;
  }

  getChecked(testId: string, host?: HTMLElement | Document): boolean | null {
    return this.query<HTMLInputElement>(testId, host)?.checked ?? null;
  }
}
