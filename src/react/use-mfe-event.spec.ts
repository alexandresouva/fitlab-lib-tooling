// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useMfeEvent } from './use-mfe-event';
import { publishMfeEvent } from '../events/mfe-events';
import {
  mockMfeContext,
  clearMfeContext
} from '../testing/context/mock-context';

describe('useMfeEvent', () => {
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    (
      globalThis as typeof globalThis & {
        IS_REACT_ACT_ENVIRONMENT: boolean;
      }
    ).IS_REACT_ACT_ENVIRONMENT = true;
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

  it('should initialize with fallback value from context', () => {
    let hookValue: string | undefined = undefined;

    function TestComponent() {
      hookValue = useMfeEvent('mfe:shell:theme-changed');
      return React.createElement('div', null, hookValue);
    }

    act(() => {
      const root = createRoot(container!);
      root.render(React.createElement(TestComponent));
    });

    expect(hookValue).toBe('dark');
  });

  it('should initialize with explicit initial value when provided', () => {
    let hookValue: string | undefined = undefined;

    function TestComponent() {
      hookValue = useMfeEvent('mfe:shell:theme-changed', 'light');
      return React.createElement('div', null, hookValue);
    }

    act(() => {
      const root = createRoot(container!);
      root.render(React.createElement(TestComponent));
    });

    expect(hookValue).toBe('light');
  });

  it('should update state when a global event is dispatched', () => {
    let hookValue: string | undefined = undefined;

    function TestComponent() {
      hookValue = useMfeEvent('mfe:shell:theme-changed');
      return React.createElement('div', null, hookValue);
    }

    act(() => {
      const root = createRoot(container!);
      root.render(React.createElement(TestComponent));
    });

    expect(hookValue).toBe('dark');

    act(() => {
      publishMfeEvent('mfe:shell:theme-changed', 'light');
    });

    expect(hookValue).toBe('light');
  });
});
