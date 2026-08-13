export interface MfeUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatarUrl?: string;
}

export type MfeTheme = 'light' | 'dark';

export interface MfeContext {
  readonly token: string;
  readonly permissions: readonly string[];
  readonly workspaceId: string;
  readonly user: Readonly<MfeUser>;
  readonly theme: MfeTheme;
  readonly locale: string;
}

export interface MfeWindow {
  readonly mfeContext?: MfeContext;
}

/**
 * Reads the synchronous MFE context directly from the browser window (Zero parameters, strictly read-only)
 */
export function getMfeContext(): MfeContext | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return (window as MfeWindow).mfeContext;
}
