import { getMfeContext, MfeContext } from './mfe-context';
import {
  EventPayload,
  MfeEventName,
  SHELL_EVENTS,
  ShellEventPayloadMap
} from '../events/mfe-events';

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
  [SHELL_EVENTS.LOCALE_CHANGED]: (context) => context.locale
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
