import { onUnmounted, ref, Ref } from 'vue';

import { getFallbackInitialValue } from '../context/mfe-fallback';
import {
  listenMfeEvent,
  EventPayload,
  MfeEventName
} from '../events/mfe-events';

/**
 * Custom Vue composable to listen to global MFE events with automatic cleanup on unmount.
 */
export function useMfeRef<E extends MfeEventName>(
  event: E,
  initialValue: EventPayload<E>
): Ref<EventPayload<E>>;

export function useMfeRef<E extends MfeEventName>(
  event: E,
  initialValue?: EventPayload<E>
): Ref<EventPayload<E> | undefined>;

export function useMfeRef<E extends MfeEventName>(
  event: E,
  initialValue?: EventPayload<E>
): Ref<EventPayload<E> | undefined> {
  const resolvedInitial = initialValue ?? getFallbackInitialValue(event);

  const valRef = ref(resolvedInitial) as Ref<EventPayload<E> | undefined>;

  const unsubscribe = listenMfeEvent(event, (data) => {
    valRef.value = data;
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return valRef;
}
