import { useEffect, useState } from 'react';

import { getFallbackInitialValue } from '../context/mfe-fallback';
import {
  listenMfeEvent,
  EventPayload,
  MfeEventName
} from '../events/mfe-events';

/**
 * Custom React hook to listen to global MFE events with automatic cleanup on unmount.
 */
export function useMfeEvent<E extends MfeEventName>(
  event: E,
  initialValue: EventPayload<E>
): EventPayload<E>;

export function useMfeEvent<E extends MfeEventName>(
  event: E,
  initialValue?: EventPayload<E>
): EventPayload<E> | undefined;

export function useMfeEvent<E extends MfeEventName>(
  event: E,
  initialValue?: EventPayload<E>
): EventPayload<E> | undefined {
  const [value, setValue] = useState<EventPayload<E> | undefined>(() => {
    return initialValue ?? getFallbackInitialValue(event);
  });

  useEffect(() => {
    const unsubscribe = listenMfeEvent(event, (data) => {
      setValue(data);
    });
    return unsubscribe;
  }, [event]);

  return value;
}
