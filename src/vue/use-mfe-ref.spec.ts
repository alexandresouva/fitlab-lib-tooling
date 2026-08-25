// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp, defineComponent, h, nextTick } from 'vue';

import { useMfeRef } from './use-mfe-ref';
import { publishMfeEvent } from '../events/mfe-events';
import {
  mockMfeContext,
  clearMfeContext
} from '../testing/context/mock-context';

describe('useMfeRef', () => {
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    mockMfeContext({
      theme: 'dark'
    });
  });

  afterEach(() => {
    if (container) {
      document.body.removeChild(container);
      container = null;
    }
    clearMfeContext();
  });

  it('should initialize with fallback value from context', async () => {
    let hookValue: string | undefined = undefined;

    const TestComponent = defineComponent({
      setup() {
        hookValue = useMfeRef('mfe:shell:theme-changed').value;
        return () => h('div', hookValue);
      }
    });

    const app = createApp(TestComponent);
    app.mount(container!);
    await nextTick();

    expect(hookValue).toBe('dark');
    app.unmount();
  });

  it('should initialize with explicit initial value when provided', async () => {
    let hookValue: string | undefined = undefined;

    const TestComponent = defineComponent({
      setup() {
        hookValue = useMfeRef('mfe:shell:theme-changed', 'light').value;
        return () => h('div', hookValue);
      }
    });

    const app = createApp(TestComponent);
    app.mount(container!);
    await nextTick();

    expect(hookValue).toBe('light');
    app.unmount();
  });

  it('should update reactive value when a global event is dispatched', async () => {
    let hookRef = null as unknown as ReturnType<
      typeof useMfeRef<'mfe:shell:theme-changed'>
    >;

    const TestComponent = defineComponent({
      setup() {
        hookRef = useMfeRef('mfe:shell:theme-changed');
        return () => h('div', hookRef?.value);
      }
    });

    const app = createApp(TestComponent);
    app.mount(container!);
    await nextTick();

    expect(hookRef?.value).toBe('dark');

    publishMfeEvent('mfe:shell:theme-changed', 'light');
    await nextTick();

    expect(hookRef?.value).toBe('light');
    app.unmount();
  });
});
