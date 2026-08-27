import { MfeEventName, EventPayload } from './mfe-events.model';
export {
  MfeEventName,
  EventPayload,
  ShellEventPayloadMap,
  MfeRouteData,
  ShellEventName
} from './mfe-events.model';

export const SHELL_EVENTS = {
  THEME_CHANGED: 'mfe:shell:theme-changed',
  USER_CHANGED: 'mfe:shell:user-changed',
  WORKSPACE_CHANGED: 'mfe:shell:workspace-changed',
  LOCALE_CHANGED: 'mfe:shell:locale-changed',
  ROUTE_CHANGED: 'mfe:shell:route-changed'
} as const;

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
