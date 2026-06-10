import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TapsList } from './taps-list';
import { TapsStats } from './components';
import { initialState, selectRows, selectIsLoading, selectIsConnected, selectStats } from './+state/tap.reducer';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { mockTapTableRowData } from 'tests/mocks/data';
import { getDefaultTapEventsSummary } from './utils';
import { EventEmitter } from '@angular/core';
import { getTapsListTestChildren } from 'tests/utils';
import { TableSort } from './types';
import { TapActions } from './+state/tap.actions';

const mockTap = mockTapTableRowData[0];
describe('TapsList', () => {
  let component: TapsList;
  let mockStore: MockStore;
  let fixture: ComponentFixture<TapsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      imports: [TapsStats],
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TapsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when there is no connection', () => {
    beforeEach(() => {
      mockStore.overrideSelector(selectRows, []);
      mockStore.overrideSelector(selectStats, getDefaultTapEventsSummary());
      mockStore.overrideSelector(selectIsLoading, false);
      mockStore.overrideSelector(selectIsConnected, false);
      mockStore.refreshState();
      fixture.detectChanges();
    });

    it('Should set the data states on the child components', async () => {
      const { headerDebugEl, statsDebugEl, tableDebugEl, headerInstance, statsInstance, tableInstance } = getTapsListTestChildren(fixture);

      expect(headerDebugEl).toBeTruthy();
      expect(statsDebugEl).toBeTruthy();
      expect(tableDebugEl).toBeTruthy();
      expect(headerInstance.connected).toBe(false);
      expect(statsInstance.summary()).toEqual(getDefaultTapEventsSummary());
      expect(tableInstance.data).toEqual([]);
      expect(tableInstance.isLoading).toEqual(false);
      expect(tableInstance.sortColumn instanceof EventEmitter).toBe(true);
    });
  });

  describe('when there is a connection but data is fetching', () => {
    beforeEach(() => {
      mockStore.overrideSelector(selectRows, []);
      mockStore.overrideSelector(selectIsLoading, true);
      mockStore.overrideSelector(selectIsConnected, true);
      mockStore.refreshState();
      fixture.detectChanges();
    });

    it('should set the data states on the child components', async () => {
      const { headerInstance, tableInstance } = getTapsListTestChildren(fixture);

      expect(headerInstance.connected).toBe(true);
      expect(tableInstance.isLoading).toEqual(true);
    });
  });

  describe('when data is fetched', () => {
    beforeEach(() => {
      mockStore.overrideSelector(selectRows, [mockTap]);
      mockStore.overrideSelector(selectStats, { total: 1, tapIns: 0, tapOuts: 1, declined: 0, errors: 0 });
      mockStore.overrideSelector(selectIsLoading, false);
      mockStore.overrideSelector(selectIsConnected, true);
      mockStore.refreshState();
      fixture.detectChanges();
    });

    it('should set the data states on the child components', async () => {
      const { headerInstance, statsInstance, tableInstance } = getTapsListTestChildren(fixture);

      expect(headerInstance.connected).toBe(true);
      expect(statsInstance.summary()).not.toEqual(getDefaultTapEventsSummary());
      expect(tableInstance.isLoading).toEqual(false);
      expect(tableInstance.data).toEqual([mockTap]);
    });
  });

  describe('when sorting is emitted', () => {
    const value: TableSort = { column: 'deviceName', direction: 'asc' };

    beforeEach(() => {
      vi.spyOn(component, 'onSortChange');
      vi.spyOn(mockStore, 'dispatch');

      const { tableInstance } = getTapsListTestChildren(fixture);

      tableInstance.sortColumn.emit(value);
      fixture.detectChanges();
    });

    it('should dispatch sorting to the store', () => {
      expect(component.onSortChange).toHaveBeenCalledWith(value);
      expect(mockStore.dispatch).toHaveBeenCalledWith(TapActions.sort(value));
    });
  });
});
