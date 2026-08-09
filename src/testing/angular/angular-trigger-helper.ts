import { DebugElement } from '@angular/core';

import { AngularQueryHelper } from './angular-query-helper';

export class AngularTriggerHelper<T> {
  constructor(private readonly queries: AngularQueryHelper<T>) {}

  private getDebugElement(testId: string, host?: DebugElement): DebugElement {
    const el = this.queries.query(testId, host);

    if (!el) {
      throw new Error(
        `[AngularTriggerHelper] Element with testId="${testId}" not found`
      );
    }

    return el;
  }

  click(testId: string, host?: DebugElement): void {
    this.getDebugElement(testId, host).triggerEventHandler('click', null);
  }

  input(testId: string, value: unknown, host?: DebugElement): void {
    this.getDebugElement(testId, host).triggerEventHandler('input', {
      target: { value }
    });
  }

  checkboxChange(testId: string, checked: boolean, host?: DebugElement): void {
    this.getDebugElement(testId, host).triggerEventHandler('change', {
      target: { checked }
    });
  }

  submit(testId: string, host?: DebugElement): void {
    this.getDebugElement(testId, host).triggerEventHandler('submit', null);
  }
}
