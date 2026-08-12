import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SHELL_EVENTS, listenMfeEvent, publishMfeEvent } from './mfe-events';

describe('mfe-events', () => {
  beforeEach(() => {
    const eventTarget = new EventTarget();
    (globalThis as unknown as { window: unknown }).window = {
      addEventListener: eventTarget.addEventListener.bind(eventTarget),
      removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
      dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget)
    };
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have correct SHELL_EVENTS constants', () => {
    expect(SHELL_EVENTS.THEME_CHANGED).toBe('mfe:shell:theme-changed');
    expect(SHELL_EVENTS.USER_CHANGED).toBe('mfe:shell:user-changed');
    expect(SHELL_EVENTS.WORKSPACE_CHANGED).toBe('mfe:shell:workspace-changed');
    expect(SHELL_EVENTS.LOCALE_CHANGED).toBe('mfe:shell:locale-changed');
  });

  it('should publish and listen to events correctly', () => {
    const callback = vi.fn();
    const unsubscribe = listenMfeEvent(SHELL_EVENTS.THEME_CHANGED, callback);

    publishMfeEvent(SHELL_EVENTS.THEME_CHANGED, 'dark');

    expect(callback).toHaveBeenCalledWith('dark');
    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe();

    publishMfeEvent(SHELL_EVENTS.THEME_CHANGED, 'light');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should support custom remote-to-remote events', () => {
    const callback = vi.fn();
    const unsubscribe = listenMfeEvent('mfe:workout:completed', callback);

    const payload = { workoutId: 'w_01', sets: 4 };
    publishMfeEvent('mfe:workout:completed', payload);

    expect(callback).toHaveBeenCalledWith(payload);

    unsubscribe();
  });
});
