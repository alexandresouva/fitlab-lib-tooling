import { DispatchHelper } from './dispatch-helper';
import { QueryHelper } from './query-helper';

/**
 * Universal framework-agnostic TestHelper for DOM-based unit and integration testing.
 * Compatible with Vanilla JS, React, Vue, Svelte, and native browser environments.
 */
export class TestHelper {
  readonly queries: QueryHelper;
  readonly dispatch: DispatchHelper;

  constructor(container: HTMLElement | Document) {
    this.queries = new QueryHelper(container);
    this.dispatch = new DispatchHelper(this.queries);
  }
}
