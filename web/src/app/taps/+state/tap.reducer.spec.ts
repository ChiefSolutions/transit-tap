import { describe, it, expect } from 'vitest';
import { tapFeature, initialState, State } from './tap.reducer';
import { TapActions } from './tap.actions';
import { TapTableRow } from '../models';
import { mockTapTableRowData } from '__mock__/data';
import { getDefaultTapEventsSummary } from '../utils';

const testRowData = mockTapTableRowData[0];

describe('Tap Reducer', () => {
  const reducer = tapFeature.reducer;
  const mockTap: TapTableRow = testRowData;

  it('should return the default initial state when an unknown action is dispatched', () => {
    const action = { type: 'Unknown Action' };
    const result = reducer(initialState, action);

    expect(result).toBe(initialState);
  });

  it('should set loading state when connecting to the stream', () => {
    const action = TapActions.connectStream();
    const dirtyState: State = {
      ...initialState,
      error: new Error('Previous Error'),
      isConnected: true,
    };
    const result = reducer(dirtyState, action);

    expect(result.isLoading).toBe(true);
    expect(result.isConnected).toBe(false);
    expect(result.error).toBeNull();
  });

  it('should append a new tap row and establish connection on eventReceived', () => {
    const summary = getDefaultTapEventsSummary();
    const action = TapActions.eventReceived({ tap: mockTap, summary });
    const existingRow = testRowData as TapTableRow;
    const startingState: State = { ...initialState, rows: [existingRow], isLoading: true };

    const result = reducer(startingState, action);

    expect(result.rows).toEqual([existingRow, mockTap]);
    expect(result.isLoading).toBe(false);
    expect(result.isConnected).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should clear loading/connection flags and store the error payload on streamError', () => {
    const mockError = new Error('Connection Timed Out');
    const action = TapActions.streamError({ error: mockError });

    const startingState: State = { ...initialState, isLoading: true, isConnected: true };
    const result = reducer(startingState, action);

    expect(result.isLoading).toBe(false);
    expect(result.isConnected).toBe(false);
    expect(result.error).toBe(mockError);
  });

  it('should wipe rows and reset connection properties when disconnecting', () => {
    const action = TapActions.disconnectStream();

    const activeState: State = {
      rows: [mockTap],
      isLoading: false,
      stats: getDefaultTapEventsSummary(),
      isConnected: true,
      error: null,
    };
    const result = reducer(activeState, action);

    expect(result.rows).toEqual([]);
    expect(result.isLoading).toBe(false);
    expect(result.isConnected).toBe(false);
  });
});
