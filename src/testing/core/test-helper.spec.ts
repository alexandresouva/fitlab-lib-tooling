import { beforeEach, describe, expect, it } from 'vitest';

import { TestHelper } from './test-helper';

describe('TestHelper (Agnostic)', () => {
  let container: HTMLDivElement;
  let helper: TestHelper;

  beforeEach(() => {
    container = {
      querySelector: (selector: string) => {
        if (selector === '[data-testid="greeting"]') {
          return { textContent: 'Hello World' } as unknown as HTMLElement;
        }
        if (selector === '[data-testid="name-input"]') {
          return { value: 'Alexandre' } as unknown as HTMLInputElement;
        }
        if (selector === '[data-testid="agree-checkbox"]') {
          return { checked: true } as unknown as HTMLInputElement;
        }
        return null;
      },
      querySelectorAll: (selector: string) => {
        if (selector === '[data-testid="item"]') {
          return [
            { textContent: 'Item 1' },
            { textContent: 'Item 2' }
          ] as unknown as NodeListOf<HTMLElement>;
        }
        return [] as unknown as NodeListOf<HTMLElement>;
      }
    } as unknown as HTMLDivElement;

    helper = new TestHelper(container);
  });

  it('should query element text content correctly', () => {
    expect(helper.queries.getTextContent('greeting')).toBe('Hello World');
    expect(helper.queries.getTextContent('non-existent')).toBeNull();
  });

  it('should query input value correctly', () => {
    expect(helper.queries.getValue('name-input')).toBe('Alexandre');
  });

  it('should query checkbox checked state correctly', () => {
    expect(helper.queries.getChecked('agree-checkbox')).toBe(true);
  });

  it('should query all matching elements', () => {
    const items = helper.queries.queryAll('item');
    expect(items.length).toBe(2);
  });
});
