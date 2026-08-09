import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

type ElementWithValue =
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export class AngularQueryHelper<T> {
  constructor(private readonly fixture: ComponentFixture<T>) {}

  private get root(): DebugElement {
    return this.fixture.debugElement;
  }

  query(testId: string, host: DebugElement = this.root): DebugElement | null {
    return (
      host.query((node) => node.nativeElement?.dataset?.testid === testId) ??
      null
    );
  }

  queryAll(testId: string, host: DebugElement = this.root): DebugElement[] {
    return host.queryAll(
      (node) => node.nativeElement?.dataset?.testid === testId
    );
  }

  getComponentInstance<C>(
    testId: string,
    host: DebugElement = this.root
  ): C | null {
    const instance = this.query(testId, host)?.componentInstance as
      C | undefined;
    return instance ?? null;
  }

  getTextContent(
    testId: string,
    host: DebugElement = this.root
  ): string | null {
    return (
      this.getNativeElement<HTMLElement>(testId, host)?.textContent?.trim() ??
      null
    );
  }

  getValue(testId: string, host: DebugElement = this.root): string | null {
    return this.getNativeElement<ElementWithValue>(testId, host)?.value ?? null;
  }

  getChecked(testId: string, host: DebugElement = this.root): boolean | null {
    return (
      this.getNativeElement<HTMLInputElement>(testId, host)?.checked ?? null
    );
  }

  getNativeElement<E extends HTMLElement = HTMLElement>(
    testId: string,
    host: DebugElement = this.root
  ): E | null {
    const debugEl = this.query(testId, host);
    return (debugEl?.nativeElement as E) ?? null;
  }
}
