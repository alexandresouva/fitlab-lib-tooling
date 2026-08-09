import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

type ElementWithValue =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export class QueryHelper<T> {
  constructor(private readonly fixture: ComponentFixture<T>) {}

  private get root(): DebugElement {
    return this.fixture.debugElement;
  }

  query(testId: string, host?: DebugElement): DebugElement | null {
    const targetHost = host ?? this.root;
    if (!targetHost) {
      return null;
    }

    return (
      targetHost.query(
        (node) =>
          node.attributes?.['data-testid'] === testId ||
          (node.nativeElement instanceof HTMLElement &&
            node.nativeElement.getAttribute('data-testid') === testId)
      ) ?? null
    );
  }

  queryAll(testId: string, host?: DebugElement): DebugElement[] {
    const targetHost = host ?? this.root;
    if (!targetHost) {
      return [];
    }

    return targetHost.queryAll(
      (node) =>
        node.attributes?.['data-testid'] === testId ||
        (node.nativeElement instanceof HTMLElement &&
          node.nativeElement.getAttribute('data-testid') === testId)
    );
  }

  getComponentInstance<C>(testId: string, host?: DebugElement): C | null {
    const instance = this.query(testId, host)?.componentInstance as
      | C
      | undefined;
    return instance ?? null;
  }

  getTextContent(testId: string, host?: DebugElement): string | null {
    return (
      this.getNativeElement<HTMLElement>(testId, host)?.textContent?.trim() ??
      null
    );
  }

  getValue(testId: string, host?: DebugElement): string | null {
    return this.getNativeElement<ElementWithValue>(testId, host)?.value ?? null;
  }

  getChecked(testId: string, host?: DebugElement): boolean | null {
    return (
      this.getNativeElement<HTMLInputElement>(testId, host)?.checked ?? null
    );
  }

  private getNativeElement<E extends HTMLElement>(
    testId: string,
    host?: DebugElement
  ): E | null {
    const targetHost = host ?? this.root;
    if (!targetHost) {
      return null;
    }

    // Direct native querySelector if available on host nativeElement
    if (
      targetHost.nativeElement &&
      typeof targetHost.nativeElement.querySelector === 'function'
    ) {
      const native = targetHost.nativeElement.querySelector(
        `[data-testid="${testId}"]`
      );
      if (native) {
        return native as E;
      }
    }

    const debugEl = this.query(testId, targetHost);
    return (debugEl?.nativeElement as E) ?? null;
  }
}
