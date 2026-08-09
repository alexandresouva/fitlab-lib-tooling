import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularQueryHelper } from './angular-query-helper';
import { AngularTestHelper } from './angular-test-helper';
import { AngularTriggerHelper } from './angular-trigger-helper';

describe('Angular Testing Helpers', () => {
  let fixture: ComponentFixture<unknown>;
  let rootDebugEl: DebugElement;
  let childDebugEl: DebugElement;
  let nativeEl: HTMLInputElement;
  let instance: { name: string };

  beforeEach(() => {
    instance = { name: 'TestComponent' };

    nativeEl = {
      dataset: { testid: 'target-input' },
      textContent: '  Hello Angular  ',
      value: 'Angular Value',
      checked: true,
      dispatchEvent: vi.fn(),
    } as unknown as HTMLInputElement;

    childDebugEl = {
      nativeElement: nativeEl,
      componentInstance: instance,
      triggerEventHandler: vi.fn(),
    } as unknown as DebugElement;

    rootDebugEl = {
      nativeElement: {
        querySelector: vi.fn(),
      },
      query: vi.fn((predicate: (node: DebugElement) => boolean) => {
        return predicate(childDebugEl) ? childDebugEl : null;
      }),
      queryAll: vi.fn((predicate: (node: DebugElement) => boolean) => {
        return predicate(childDebugEl) ? [childDebugEl] : [];
      }),
    } as unknown as DebugElement;

    fixture = {
      debugElement: rootDebugEl,
      nativeElement: rootDebugEl.nativeElement,
    } as unknown as ComponentFixture<unknown>;
  });

  describe('AngularQueryHelper', () => {
    let queries: AngularQueryHelper<unknown>;

    beforeEach(() => {
      queries = new AngularQueryHelper(fixture);
    });

    it('should query DebugElement by dataset testid', () => {
      const el = queries.query('target-input');
      expect(el).toBe(childDebugEl);
    });

    it('should return null when querying non-existent testid', () => {
      const el = queries.query('non-existent');
      expect(el).toBeNull();
    });

    it('should queryAll DebugElements matching testid', () => {
      const list = queries.queryAll('target-input');
      expect(list.length).toBe(1);
      expect(list[0]).toBe(childDebugEl);
    });

    it('should get component instance', () => {
      const comp = queries.getComponentInstance<{ name: string }>('target-input');
      expect(comp?.name).toBe('TestComponent');
    });

    it('should return null component instance if element not found', () => {
      const comp = queries.getComponentInstance('missing');
      expect(comp).toBeNull();
    });

    it('should extract trimmed text content', () => {
      expect(queries.getTextContent('target-input')).toBe('Hello Angular');
      expect(queries.getTextContent('missing')).toBeNull();
    });

    it('should extract input value', () => {
      expect(queries.getValue('target-input')).toBe('Angular Value');
      expect(queries.getValue('missing')).toBeNull();
    });

    it('should extract checkbox checked status', () => {
      expect(queries.getChecked('target-input')).toBe(true);
      expect(queries.getChecked('missing')).toBeNull();
    });

    it('should get native element', () => {
      const el = queries.getNativeElement<HTMLInputElement>('target-input');
      expect(el).toBe(nativeEl);
    });
  });

  describe('AngularTriggerHelper', () => {
    let queries: AngularQueryHelper<unknown>;
    let trigger: AngularTriggerHelper<unknown>;

    beforeEach(() => {
      queries = new AngularQueryHelper(fixture);
      trigger = new AngularTriggerHelper(queries);
    });

    it('should trigger click event', () => {
      trigger.click('target-input');
      expect(childDebugEl.triggerEventHandler).toHaveBeenCalledWith('click', null);
    });

    it('should trigger input event with target value', () => {
      trigger.input('target-input', 'new text');
      expect(childDebugEl.triggerEventHandler).toHaveBeenCalledWith('input', {
        target: { value: 'new text' },
      });
    });

    it('should trigger checkboxChange event with target checked', () => {
      trigger.checkboxChange('target-input', false);
      expect(childDebugEl.triggerEventHandler).toHaveBeenCalledWith('change', {
        target: { checked: false },
      });
    });

    it('should trigger submit event', () => {
      trigger.submit('target-input');
      expect(childDebugEl.triggerEventHandler).toHaveBeenCalledWith('submit', null);
    });

    it('should throw error when triggering on non-existent element', () => {
      expect(() => trigger.click('missing')).toThrow(
        '[AngularTriggerHelper] Element with testId="missing" not found'
      );
    });
  });

  describe('AngularTestHelper', () => {
    it('should instantiate all helpers correctly', () => {
      const helper = new AngularTestHelper(fixture);
      expect(helper.queries).toBeDefined();
      expect(helper.trigger).toBeDefined();
      expect(helper.dispatch).toBeDefined();
      expect(helper.fixture).toBe(fixture);
    });
  });
});
