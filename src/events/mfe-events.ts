import { MfeTheme, MfeUser } from '../context/mfe-context';

export const SHELL_EVENTS = {
  THEME_CHANGED: 'mfe:shell:theme-changed',
  USER_CHANGED: 'mfe:shell:user-changed',
  WORKSPACE_CHANGED: 'mfe:shell:workspace-changed',
  LOCALE_CHANGED: 'mfe:shell:locale-changed'
} as const;

export type ShellEventName = (typeof SHELL_EVENTS)[keyof typeof SHELL_EVENTS];
export type MfeEventName = ShellEventName | (string & {});

export interface ShellEventPayloadMap {
  [SHELL_EVENTS.THEME_CHANGED]: MfeTheme;
  [SHELL_EVENTS.USER_CHANGED]: Readonly<MfeUser>;
  [SHELL_EVENTS.WORKSPACE_CHANGED]: string;
  [SHELL_EVENTS.LOCALE_CHANGED]: string;
}

export type EventPayload<E extends MfeEventName> =
  E extends keyof ShellEventPayloadMap ? ShellEventPayloadMap[E] : unknown;

/**
 * Publishes a strongly-typed MFE event via the browser's DOM event system
 */
export function publishMfeEvent<E extends MfeEventName>(
  event: E,
  detail: EventPayload<E>
): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new CustomEvent(event, { detail }));
}

/**
 * Listens to an MFE event and returns an unsubscribe cleanup function
 */
export function listenMfeEvent<E extends MfeEventName>(
  event: E,
  callback: (detail: EventPayload<E>) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const handler = (e: Event) =>
    callback((e as CustomEvent<EventPayload<E>>).detail);
  window.addEventListener(event, handler);
  return () => window.removeEventListener(event, handler);
}
