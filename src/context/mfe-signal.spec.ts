import {
  EnvironmentInjector,
  createEnvironmentInjector,
  runInInjectionContext
} from '@angular/core';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useMfeSignal } from './mfe-signal';
import { SHELL_EVENTS, publishMfeEvent } from '../events/mfe-events';

describe('useMfeSignal', () => {
  let injector: EnvironmentInjector;

  beforeEach(() => {
    const eventTarget = new EventTarget();
    (globalThis as unknown as { window: unknown }).window = {
      addEventListener: eventTarget.addEventListener.bind(eventTarget),
      removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
      dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
      mfeContext: undefined
    };

    injector = createEnvironmentInjector(
      [],
      null as unknown as EnvironmentInjector
    );

    vi.restoreAllMocks();
  });

  afterEach(() => {
    try {
      injector.destroy();
    } catch {}
    vi.restoreAllMocks();
  });

  it('should initialize signal with provided initial value and update on event inside injection context', () => {
    runInInjectionContext(injector, () => {
      const sig = useMfeSignal(SHELL_EVENTS.THEME_CHANGED, 'light');
      expect(sig()).toBe('light');

      publishMfeEvent(SHELL_EVENTS.THEME_CHANGED, 'dark');
      expect(sig()).toBe('dark');
    });
  });

  it('should support explicit injector option when called outside active injection context', () => {
    const sig = useMfeSignal(SHELL_EVENTS.THEME_CHANGED, 'light', {
      injector
    });
    expect(sig()).toBe('light');

    publishMfeEvent(SHELL_EVENTS.THEME_CHANGED, 'dark');
    expect(sig()).toBe('dark');
  });

  it('should throw when called outside injection context without an explicit injector', () => {
    expect(() => useMfeSignal(SHELL_EVENTS.THEME_CHANGED, 'light')).toThrow();
  });

  it('should read initial value from window.mfeContext if not explicitly provided', () => {
    (
      globalThis as unknown as { window: { mfeContext: unknown } }
    ).window.mfeContext = {
      theme: 'dark',
      user: { id: 'u1', name: 'Alexandre', email: 'alex@fitlab.dev' },
      token: '',
      permissions: [],
      workspaceId: 'ws_01',
      locale: 'pt-BR'
    };

    runInInjectionContext(injector, () => {
      const themeSig = useMfeSignal(SHELL_EVENTS.THEME_CHANGED);
      expect(themeSig()).toBe('dark');

      const userSig = useMfeSignal(SHELL_EVENTS.USER_CHANGED);
      expect(userSig()?.name).toBe('Alexandre');

      const wsSig = useMfeSignal(SHELL_EVENTS.WORKSPACE_CHANGED);
      expect(wsSig()).toBe('ws_01');

      const localeSig = useMfeSignal(SHELL_EVENTS.LOCALE_CHANGED);
      expect(localeSig()).toBe('pt-BR');
    });
  });

  it('should unregister listener when injector is destroyed', () => {
    let sig: ReturnType<typeof useMfeSignal>;
    runInInjectionContext(injector, () => {
      sig = useMfeSignal(SHELL_EVENTS.THEME_CHANGED, 'light');
    });

    expect(sig!()).toBe('light');

    // Destroy the injector which triggers DestroyRef.onDestroy
    injector.destroy();

    // Event after destroy should no longer update the signal
    publishMfeEvent(SHELL_EVENTS.THEME_CHANGED, 'dark');
    expect(sig!()).toBe('light');
  });
});
