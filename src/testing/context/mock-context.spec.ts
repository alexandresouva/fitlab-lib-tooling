import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { mockMfeContext, clearMfeContext } from './mock-context';
import { getMfeContext } from '../../context/mfe-context';

describe('mock-context', () => {
  beforeEach(() => {
    (globalThis as { window: typeof globalThis }).window = globalThis;
    clearMfeContext();
  });

  afterEach(() => {
    clearMfeContext();
  });

  it('should inject frozen mock context into window object', () => {
    mockMfeContext({
      token: 'test-token',
      permissions: ['workout:read'],
      workspaceId: 'ws_test',
      user: {
        id: 'usr_99',
        name: 'Tester',
        email: 'test@example.com'
      },
      theme: 'dark',
      locale: 'pt-BR'
    });

    const ctx = getMfeContext();
    expect(ctx?.token).toBe('test-token');
    expect(ctx?.permissions).toEqual(['workout:read']);
    expect(ctx?.workspaceId).toBe('ws_test');
    expect(ctx?.user.name).toBe('Tester');
    expect(ctx?.theme).toBe('dark');
    expect(ctx?.locale).toBe('pt-BR');
    expect(Object.isFrozen(ctx)).toBe(true);
    expect(Object.isFrozen(ctx?.permissions)).toBe(true);
    expect(Object.isFrozen(ctx?.user)).toBe(true);
  });

  it('should clear mock context with clearMfeContext', () => {
    mockMfeContext({ token: 'test-token' });
    expect(getMfeContext()).toBeDefined();

    clearMfeContext();
    expect(getMfeContext()).toBeUndefined();
  });
});
