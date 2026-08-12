import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useMfeSignal } from './mfe-signal';
import { SHELL_EVENTS, publishMfeEvent } from '../events/mfe-events';

describe('useMfeSignal', () => {
  beforeEach(() => {
    const eventTarget = new EventTarget();
    (globalThis as unknown as { window: unknown }).window = {
      addEventListener: eventTarget.addEventListener.bind(eventTarget),
      removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
      dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
      mfeContext: undefined
    };
    vi.restoreAllMocks();
  });

  it('should initialize signal with provided initial value and update on event', () => {
    const sig = useMfeSignal(SHELL_EVENTS.THEME_CHANGED, 'light');
    expect(sig()).toBe('light');

    publishMfeEvent(SHELL_EVENTS.THEME_CHANGED, 'dark');
    expect(sig()).toBe('dark');
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

    const themeSig = useMfeSignal(SHELL_EVENTS.THEME_CHANGED);
    expect(themeSig()).toBe('dark');

    const userSig = useMfeSignal(SHELL_EVENTS.USER_CHANGED);
    expect(userSig()?.name).toBe('Alexandre');

    const wsSig = useMfeSignal(SHELL_EVENTS.WORKSPACE_CHANGED);
    expect(wsSig()).toBe('ws_01');

    const localeSig = useMfeSignal(SHELL_EVENTS.LOCALE_CHANGED);
    expect(localeSig()).toBe('pt-BR');
  });

  it('should work with custom event names', () => {
    const customSig = useMfeSignal('mfe:custom:counter', 10);
    expect(customSig()).toBe(10);

    publishMfeEvent('mfe:custom:counter', 25);
    expect(customSig()).toBe(25);
  });
});
