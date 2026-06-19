import { describe, it, expect } from 'vitest';
import { tapFeature, initialState, TapState } from './tap.reducer';
import { TapActions } from './tap.actions';
import { TapRowWithStats, TapEventsSummary, TableSort } from '../types';
import { mockTapTableRowData, mockTapEventsResponse } from 'tests/mocks/data';
import { Action } from '@ngrx/store';
import { isRowDataSorted, dispatchTestReducerActions } from 'tests/utils';

const mockTap = mockTapTableRowData[0];

describe('Tap Reducer', () => {
  const reducer = tapFeature.reducer;

  describe('when an unknown action is dispatched', () => {
    let action;
    let result: TapState;

    beforeEach(() => {
      action = { type: 'Unknown Action' };
      result = reducer(initialState, action);
    });

    it('should return the default initial state', () => {
      expect(result).toBe(initialState);
    });
  });

  describe('when connect stream action is dispatched', () => {
    let result: TapState;

    beforeEach(() => {
      const action = TapActions.connectStream();
      const dirtyState: TapState = {
        ...initialState,
        error: new Error('Previous Error'),
        isConnected: true,
      };

      result = reducer(dirtyState, action);
    });

    it('should set loading state when connecting to the stream', () => {
      expect(result.isLoading).toBe(true);
      expect(result.isConnected).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('when event received is dispatched', () => {
    let action: TapRowWithStats & Action<'[Tap Domain] eventReceived'>;
    let summary: TapEventsSummary;

    beforeEach(() => {
      summary = { declined: 0, errors: 0, tapOuts: 1, total: 1, tapIns: 0 };
      action = TapActions.eventReceived({ tap: mockTap, summary });
    });

    it('should append a new tap row and establish connection', () => {
      const result = reducer(initialState, action);

      expect(result.rows).toEqual([mockTap]);
      expect(result.stats).toEqual(summary);
      expect(result.rows).not.toEqual(initialState);
      expect(result.stats).not.toEqual(initialState.stats);
      expect(result.isLoading).toBe(false);
      expect(result.isConnected).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('when an event is received while sorting is required', () => {
    let eventReceivedAction: TapRowWithStats & Action<'[Tap Domain] eventReceived'>;
    let state: TapState;
    const sort: TableSort = { column: 'deviceName', direction: 'asc' };

    beforeEach(() => {
      const result = dispatchTestReducerActions(mockTapEventsResponse, reducer, sort);

      state = result.state;
      eventReceivedAction = result.eventReceivedAction;
    });

    it('should append a new tap row and sort the results', () => {
      const resultState = reducer(state, eventReceivedAction);
      const visibleRows = tapFeature.selectRows.projector(resultState.rows, resultState.filterName, resultState.sort);

      expect(resultState.sort.direction).toEqual(sort.direction);
      expect(resultState.sort.column).toEqual(sort.column);
      expect(isRowDataSorted(visibleRows, sort)).toBe(true);
    });
  });

  describe('when sorting event is dispatched for none', () => {
    let eventReceivedAction: TapRowWithStats & Action<'[Tap Domain] eventReceived'>;
    let state: TapState;
    const sort: TableSort = { column: 'deviceName', direction: 'none' };

    beforeEach(() => {
      const result = dispatchTestReducerActions(mockTapEventsResponse, reducer, sort);

      state = result.state;
      eventReceivedAction = result.eventReceivedAction;
    });

    it('should not sort the rows', () => {
      const result = reducer(state, eventReceivedAction);

      expect(result.rows).toEqual(result.rows);
      expect(isRowDataSorted(result.rows, sort)).toBe(false);
      expect(isRowDataSorted(result.rows, sort)).toBe(false);
    });
  });

  describe('when sorting event is dispatched for desc', () => {
    let eventReceivedAction: TapRowWithStats & Action<'[Tap Domain] eventReceived'>;
    let state: TapState;
    const sort: TableSort = { column: 'deviceName', direction: 'desc' };

    beforeEach(() => {
      const result = dispatchTestReducerActions(mockTapEventsResponse, reducer, sort);

      state = result.state;
      eventReceivedAction = result.eventReceivedAction;
    });

    it('should not sort the rows', () => {
      const result = reducer(state, eventReceivedAction);

      expect(isRowDataSorted(result.rows, sort)).toBe(false);
    });
  });

  describe('when filter event is dispatched', () => {
    let filterAction: ReturnType<typeof TapActions.filter>;
    beforeEach(() => {
      filterAction = TapActions.filter({ name: 'TapIn' });
    });

    it('should filter the rows based on the filter name', () => {
      const mockTapIn = mockTapTableRowData[2];
      const result = reducer({ ...initialState, rows: [mockTap, mockTapIn] }, filterAction);
      const rows = tapFeature.selectRows.projector(result.rows, result.filterName, result.sort);

      expect(rows.length).toEqual(1);
      expect(rows[0]).toEqual(mockTapIn);
    });
  });

  describe('when a stream error occurs', () => {
    let action: Action<'[Tap Domain] streamError'>;
    let state: TapState;
    const mockError = new Error('Connection Timed Out');

    beforeEach(() => {
      action = TapActions.streamError({ error: mockError });

      state = { ...initialState, isLoading: true, isConnected: true };
    });

    it('should clear loading or connection flags and store the error payload on streamError', () => {
      const result = reducer(state, action);

      expect(result.isLoading).toBe(false);
      expect(result.isConnected).toBe(false);
      expect(result.error).toBe(mockError);
    });
  });

  describe('when the connection is disconnected', () => {
    let action: Action<'[Tap Domain] disconnectStream'>;

    beforeEach(() => {
      action = TapActions.disconnectStream();
    });

    it('should wipe rows and reset connection properties when disconnecting', () => {
      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
