import { ComponentFixture } from '@angular/core/testing';
import { DispatchHelper, QueryHelper } from '../core';
import { AngularQueryHelper } from './angular-query-helper';
import { AngularTriggerHelper } from './angular-trigger-helper';

/**
 * Specialized TestHelper adapter for Angular components using ComponentFixture.
 *
 * Provides:
 * - queries: AngularQueryHelper with DebugElement queries and getComponentInstance<C>()
 * - trigger: AngularTriggerHelper using DebugElement.triggerEventHandler
 * - dispatch: DispatchHelper dispatching native DOM events with bubbling on fixture.nativeElement
 * - fixture: the underlying ComponentFixture<T>
 */
export class AngularTestHelper<T> {
  readonly queries: AngularQueryHelper<T>;
  readonly trigger: AngularTriggerHelper<T>;
  readonly dispatch: DispatchHelper;
  readonly fixture: ComponentFixture<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
    this.queries = new AngularQueryHelper(fixture);
    this.trigger = new AngularTriggerHelper(this.queries);
    this.dispatch = new DispatchHelper(new QueryHelper(fixture.nativeElement));
  }
}
