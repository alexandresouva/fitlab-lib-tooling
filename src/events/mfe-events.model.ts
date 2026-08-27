import { SHELL_EVENTS } from './mfe-events';
import { MfeTheme, MfeUser } from '../context/mfe-context';

export type ShellEventName = (typeof SHELL_EVENTS)[keyof typeof SHELL_EVENTS];
export type MfeEventName = ShellEventName | (string & {});

export type EventPayload<E extends MfeEventName> =
  E extends keyof ShellEventPayloadMap ? ShellEventPayloadMap[E] : unknown;

export interface ShellEventPayloadMap {
  [SHELL_EVENTS.THEME_CHANGED]: MfeTheme;
  [SHELL_EVENTS.USER_CHANGED]: Readonly<MfeUser>;
  [SHELL_EVENTS.WORKSPACE_CHANGED]: string;
  [SHELL_EVENTS.LOCALE_CHANGED]: string;
  [SHELL_EVENTS.ROUTE_CHANGED]: MfeRouteData;
}

export interface MfeRouteData {
  readonly path: string;
  readonly params: Readonly<Record<string, string>>;
  readonly queryParams: Readonly<Record<string, string>>;
}
