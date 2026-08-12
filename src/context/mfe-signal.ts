import { DestroyRef, Signal, inject, signal } from '@angular/core';

import { getMfeContext } from './mfe-context';
import {
  EventPayload,
  MfeEventName,
  SHELL_EVENTS,
  listenMfeEvent
} from '../events/mfe-events';

function getFallbackInitialValue<E extends MfeEventName>(
  event: E
): EventPayload<E> | undefined {
  const context = getMfeContext();
  if (!context) return undefined;

  switch (event) {
    case SHELL_EVENTS.THEME_CHANGED:
      return context.theme as EventPayload<E>;
    case SHELL_EVENTS.USER_CHANGED:
      return context.user as EventPayload<E>;
    case SHELL_EVENTS.WORKSPACE_CHANGED:
      return context.workspaceId as EventPayload<E>;
    case SHELL_EVENTS.LOCALE_CHANGED:
      return context.locale as EventPayload<E>;
    default:
      return undefined;
  }
}

/**
 * Creates an Angular Signal connected to an MFE event with automatic cleanup on destroy
 */
export function useMfeSignal<E extends MfeEventName>(
  event: E,
  initialValue?: EventPayload<E>
): Signal<EventPayload<E>> {
  const resolvedInitial =
    initialValue !== undefined
      ? initialValue
      : (getFallbackInitialValue(event) as EventPayload<E>);

  const sliceSignal = signal<EventPayload<E>>(resolvedInitial);

  const unsubscribe = listenMfeEvent(event, (data) => {
    sliceSignal.set(data);
  });

  try {
    const destroyRef = inject(DestroyRef, { optional: true });
    destroyRef?.onDestroy(unsubscribe);
  } catch {
    // Graceful fallback when called outside an active injection context
  }

  return sliceSignal.asReadonly();
}
