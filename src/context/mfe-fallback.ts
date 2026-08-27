import { getMfeContext, MfeContext } from './mfe-context';
import { SHELL_EVENTS } from '../events/mfe-events';
import {
  EventPayload,
  MfeEventName,
  ShellEventPayloadMap
} from '../events/mfe-events.model';

// Mapped type to ensure every shell event maps to a resolver returning the correct payload type
type FallbackResolversMap = {
  [K in keyof ShellEventPayloadMap]: (
    context: MfeContext
  ) => ShellEventPayloadMap[K];
};

const FALLBACK_RESOLVERS: FallbackResolversMap = {
  [SHELL_EVENTS.THEME_CHANGED]: (context) => context.theme,
  [SHELL_EVENTS.USER_CHANGED]: (context) => context.user,
  [SHELL_EVENTS.WORKSPACE_CHANGED]: (context) => context.workspaceId,
  [SHELL_EVENTS.LOCALE_CHANGED]: (context) => context.locale,
  [SHELL_EVENTS.ROUTE_CHANGED]: () => ({
    path: '',
    params: Object.freeze({}),
    queryParams: Object.freeze({})
  })
};

/**
 * Helper function to retrieve fallback initial value for MFE context events.
 */
export function getFallbackInitialValue<E extends MfeEventName>(
  event: E
): EventPayload<E> | undefined {
  const context = getMfeContext();
  if (!context) return undefined;

  const resolver = (
    FALLBACK_RESOLVERS as Record<string, (context: MfeContext) => unknown>
  )[event];

  return resolver ? (resolver(context) as EventPayload<E>) : undefined;
}
