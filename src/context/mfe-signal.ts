import { DestroyRef, Injector, Signal, inject, signal } from '@angular/core';

import { getFallbackInitialValue } from './mfe-fallback';
import {
  EventPayload,
  MfeEventName,
  listenMfeEvent
} from '../events/mfe-events';

export interface UseMfeSignalOptions {
  /**
   * Optional custom Injector to retrieve DestroyRef when called outside of an active injection context.
   */
  injector?: Injector;
}

/**
 * Creates an Angular Signal connected to an MFE event with guaranteed automatic cleanup on destroy.
 * Must be called within an active injection context or provided with an explicit Injector option.
 */
export function useMfeSignal<E extends MfeEventName>(
  event: E,
  initialValue?: EventPayload<E>,
  options?: UseMfeSignalOptions
): Signal<EventPayload<E>> {
  const destroyRef = options?.injector
    ? options.injector.get(DestroyRef)
    : inject(DestroyRef);

  const resolvedInitial =
    initialValue ?? (getFallbackInitialValue(event) as EventPayload<E>);

  const sliceSignal = signal<EventPayload<E>>(resolvedInitial);

  const unsubscribe = listenMfeEvent(event, (data) => {
    sliceSignal.set(data);
  });

  destroyRef.onDestroy(unsubscribe);

  return sliceSignal.asReadonly();
}
