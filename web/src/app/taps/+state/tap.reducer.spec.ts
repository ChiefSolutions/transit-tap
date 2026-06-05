import { describe, it, expect } from 'vitest';
import { tapFeature, initialState, State } from './tap.reducer';
import { TapActions } from './tap.actions';
import { TapTableRow } from '../models';
import { mockTapTableRowData } from 'tests/mocks/data';
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

    expect(result.rows).toEqual([mockTap]);
    expect(result.isLoading).toBe(false);
    expect(result.isConnected).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should not sort the array when direction is none', () => {
    const summary = getDefaultTapEventsSummary();
    const action = TapActions.sort({ direction: 'none', column: 'deviceName' });

    const startingState: State = {
      ...initialState,
      rows: mockTapTableRowData,
      stats: summary,
      unsortedRows: mockTapTableRowData,
      isLoading: false,
    };

    const result = reducer(startingState, action);

    expect(result.rows).toEqual(result.unsortedRows);
  });

  it('should sort the array when direction is asc', () => {
    const summary = getDefaultTapEventsSummary();
    const action = TapActions.sort({ direction: 'asc', column: 'deviceName' });

    const startingState: State = {
      ...initialState,
      rows: mockTapTableRowData,
      stats: summary,
      unsortedRows: mockTapTableRowData,
      isLoading: false,
    };

    const result = reducer(startingState, action);

    expect(result.rows).not.toEqual(result.unsortedRows);
  });

  it('should not sort the data when direction is asc', () => {
    const summary = getDefaultTapEventsSummary();
    const action = TapActions.eventReceived({ tap: mockTap, summary });

    const startingState: State = {
      ...initialState,
      rows: mockTapTableRowData,
      sortColumn: 'deviceName',
      sortDirection: 'asc',
      stats: summary,
      unsortedRows: [...mockTapTableRowData],
      isLoading: false,
    };

    const result = reducer(startingState, action);

    expect(result.rows).not.toEqual(result.unsortedRows);
  });

  it('should sort the data when direction is desc', () => {
    const summary = getDefaultTapEventsSummary();
    const action = TapActions.eventReceived({ tap: mockTap, summary });
    const maxedRows = Array(200).fill(testRowData);
    const startingState: State = {
      ...initialState,
      rows: maxedRows,
      sortColumn: 'deviceName',
      sortDirection: 'desc',
      stats: summary,
      unsortedRows: [...mockTapTableRowData],
      isLoading: false,
    };

    const result = reducer(startingState, action);

    expect(result.rows).not.toEqual(result.unsortedRows);
  });

  it('should truncate the arrays to a maximum of 200 items when capacity is exceeded', () => {
    const summary = getDefaultTapEventsSummary();
    const action = TapActions.eventReceived({ tap: mockTap, summary });

    const maxedRows = Array(200).fill(testRowData);
    const startingState: State = {
      ...initialState,
      rows: maxedRows,
      unsortedRows: maxedRows,
    };

    const result = reducer(startingState, action);

    expect(result.unsortedRows.length).toEqual(200);
    expect(result.rows.length).toEqual(200);

    expect(result.unsortedRows[0]).toEqual(mockTap);
    expect(result.rows[0]).toEqual(mockTap);
  });

  it('should clear loading or connection flags and store the error payload on streamError', () => {
    const mockError = new Error('Connection Timed Out');
    const action = TapActions.streamError({ error: mockError });

    const startingState: State = { ...initialState, isLoading: true, isConnected: true };
    const result = reducer(startingState, action);

    expect(result.isLoading).toBe(false);
    expect(result.isConnected).toBe(false);
    expect(result.error).toBe(mockError);
  });

  it('should wipe rows and reset connection properties when disconnecting', () => {
    const activeState: State = {
      rows: [mockTap],
      unsortedRows: [],
      sortColumn: '',
      isLoading: false,
      stats: getDefaultTapEventsSummary(),
      isConnected: true,
      error: null,
      sortDirection: 'none',
    };
    const action = TapActions.disconnectStream();
    const result = reducer(activeState, action);

    expect(result.rows).toEqual([]);
    expect(result.isLoading).toBe(false);
    expect(result.isConnected).toBe(false);
  });
});
