import { MfeContext } from '../../context/mfe-context';

const DEFAULT_MOCK_CONTEXT: MfeContext = Object.freeze({
  token: 'mock-jwt-token',
  permissions: Object.freeze([]),
  workspaceId: 'ws_fitlab_mock',
  user: Object.freeze({
    id: 'usr_mock_123',
    name: 'Mock User',
    email: 'mock@example.com',
  }),
  theme: 'light',
  locale: 'en-US',
});

/**
 * Injects a mock MFE context into the window object for unit/integration testing
 */
export function mockMfeContext(context?: Partial<MfeContext>): void {
  const win = window as unknown as { mfeContext?: MfeContext };

  win.mfeContext = Object.freeze({
    ...DEFAULT_MOCK_CONTEXT,
    ...context,
    permissions: context?.permissions
      ? Object.freeze([...context.permissions])
      : DEFAULT_MOCK_CONTEXT.permissions,
    user: context?.user
      ? Object.freeze({ ...context.user })
      : DEFAULT_MOCK_CONTEXT.user,
  });
}

/**
 * Clears the mock MFE context from the window object
 */
export function clearMfeContext(): void {
  const win = window as unknown as { mfeContext?: MfeContext };
  delete win.mfeContext;
}
