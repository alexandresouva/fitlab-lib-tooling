import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getMfeContext, MfeContext } from './mfe-context';

describe('mfe-context', () => {
  beforeEach(() => {
    (globalThis as { window: typeof globalThis }).window = globalThis;
    delete (globalThis as { mfeContext?: MfeContext }).mfeContext;
  });

  afterEach(() => {
    delete (globalThis as { mfeContext?: MfeContext }).mfeContext;
  });

  it('should return undefined when window.mfeContext is not defined', () => {
    expect(getMfeContext()).toBeUndefined();
  });

  it('should return mfeContext when populated on window object', () => {
    const context: MfeContext = {
      token: 'mock-jwt-token',
      permissions: ['workout:read', 'workout:write'],
      workspaceId: 'ws_fitlab_hq',
      user: {
        id: 'usr_123',
        name: 'Alexandre Souza',
        email: 'alexandre@example.com'
      },
      theme: 'dark',
      locale: 'pt-BR'
    };

    (globalThis as { mfeContext?: MfeContext }).mfeContext = context;
    const result = getMfeContext();
    expect(result).toEqual(context);
    expect(result?.token).toBe('mock-jwt-token');
    expect(result?.workspaceId).toBe('ws_fitlab_hq');
    expect(result?.user.name).toBe('Alexandre Souza');
    expect(result?.theme).toBe('dark');
    expect(result?.locale).toBe('pt-BR');
  });
});
