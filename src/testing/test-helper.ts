import { ComponentFixture } from '@angular/core/testing';
import { DispatchHelper } from './dispatch-helper';
import { QueryHelper } from './query-helper';
import { TriggerHelper } from './trigger-helper';

/**
 * TestHelper is the unified entry point for interacting with Angular components in tests.
 *
 * It composes three helpers with distinct responsibilities:
 *
 * - queries:
 *   Read-only helpers to find elements and extract information (text, values, child component instances).
 *
 * - trigger:
 *   Uses Angular DebugElement to trigger event handlers directly without simulating full browser DOM bubbling.
 *   Best for fast, isolated unit tests.
 *
 * - dispatch:
 *   Dispatches real DOM events on native elements with full event bubbling and cancellation.
 *   Required when testing HostListeners or interactions depending on browser event propagation.
 */
export class TestHelper<T> {
  readonly queries: QueryHelper<T>;
  readonly trigger: TriggerHelper<T>;
  readonly dispatch: DispatchHelper<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.queries = new QueryHelper(fixture);
    this.trigger = new TriggerHelper(this.queries);
    this.dispatch = new DispatchHelper(this.queries);
  }
}
