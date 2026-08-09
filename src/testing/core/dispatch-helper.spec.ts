import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DispatchHelper } from './dispatch-helper';
import { QueryHelper } from './query-helper';

describe('DispatchHelper (Core)', () => {
  let container: HTMLDivElement;
  let queries: QueryHelper;
  let dispatch: DispatchHelper;

  let btn: HTMLButtonElement;
  let input: HTMLInputElement;
  let checkbox: HTMLInputElement;
  let form: HTMLFormElement;

  const originalMouseEvent = globalThis.MouseEvent;
  const originalInputEvent = globalThis.InputEvent;
  const originalEvent = globalThis.Event;
  const originalDocument = (globalThis as { document?: Document }).document;

  beforeEach(() => {
    class MockEvent {
      constructor(public type: string, public options?: EventInit) {}
    }
    class MockMouseEvent extends MockEvent {}
    class MockInputEvent extends MockEvent {}

    globalThis.Event = MockEvent as unknown as typeof Event;
    globalThis.MouseEvent = MockMouseEvent as unknown as typeof MouseEvent;
    globalThis.InputEvent = MockInputEvent as unknown as typeof InputEvent;
    (globalThis as { document: Document }).document = {
      dispatchEvent: vi.fn(),
    } as unknown as Document;

    btn = {
      dispatchEvent: vi.fn(),
    } as unknown as HTMLButtonElement;

    input = {
      value: '',
      dispatchEvent: vi.fn(),
    } as unknown as HTMLInputElement;

    checkbox = {
      checked: false,
      dispatchEvent: vi.fn(),
    } as unknown as HTMLInputElement;

    form = {
      dispatchEvent: vi.fn(),
    } as unknown as HTMLFormElement;

    container = {
      querySelector: (selector: string) => {
        if (selector === '[data-testid="submit-btn"]') return btn;
        if (selector === '[data-testid="email-input"]') return input;
        if (selector === '[data-testid="terms-checkbox"]') return checkbox;
        if (selector === '[data-testid="login-form"]') return form;
        return null;
      },
    } as unknown as HTMLDivElement;

    queries = new QueryHelper(container);
    dispatch = new DispatchHelper(queries);
  });

  afterEach(() => {
    globalThis.MouseEvent = originalMouseEvent;
    globalThis.InputEvent = originalInputEvent;
    globalThis.Event = originalEvent;
    if (originalDocument) {
      (globalThis as { document: Document }).document = originalDocument;
    } else {
      delete (globalThis as { document?: Document }).document;
    }
  });

  it('should dispatch click event on existing element', () => {
    dispatch.click('submit-btn');
    expect(btn.dispatchEvent).toHaveBeenCalledWith(expect.any(globalThis.MouseEvent));
  });

  it('should throw error when clicking non-existent element', () => {
    expect(() => dispatch.click('missing-btn')).toThrow(
      '[DispatchHelper] Element with testId="missing-btn" not found'
    );
  });

  it('should dispatch input event and set value', () => {
    dispatch.input('email-input', 'user@example.com');
    expect(input.value).toBe('user@example.com');
    expect(input.dispatchEvent).toHaveBeenCalledWith(expect.any(globalThis.InputEvent));
  });

  it('should throw error when setting value on non-existent input', () => {
    expect(() => dispatch.input('missing-input', 'val')).toThrow(
      '[DispatchHelper] Element with testId="missing-input" not found'
    );
  });

  it('should dispatch change event and set checked state', () => {
    dispatch.checkboxChange('terms-checkbox', true);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.dispatchEvent).toHaveBeenCalledWith(expect.any(globalThis.Event));
  });

  it('should throw error when changing non-existent checkbox', () => {
    expect(() => dispatch.checkboxChange('missing-chk', true)).toThrow(
      '[DispatchHelper] Element with testId="missing-chk" not found'
    );
  });

  it('should dispatch submit event on form', () => {
    dispatch.submit('login-form');
    expect(form.dispatchEvent).toHaveBeenCalledWith(expect.any(globalThis.Event));
  });

  it('should throw error when submitting non-existent form', () => {
    expect(() => dispatch.submit('missing-form')).toThrow(
      '[DispatchHelper] Element with testId="missing-form" not found'
    );
  });

  it('should dispatch click at viewport point on document', () => {
    dispatch.clickAtViewportPoint(100, 200);
    expect(document.dispatchEvent).toHaveBeenCalledWith(expect.any(globalThis.MouseEvent));
  });
});
