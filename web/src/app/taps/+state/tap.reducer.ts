import { createFeature, createReducer, on } from '@ngrx/store';
import { TapTableRow, TapEventsSummary, SortDirection } from '../types';
import { TapActions } from './tap.actions';
import { getDefaultTapEventsSummary, sortTapsResponseData } from '../utils';

export interface TapState {
  rows: TapTableRow[];
  sortColumn: keyof TapTableRow;
  unsortedRows: TapTableRow[];
  sortDirection: SortDirection;
  stats: TapEventsSummary;
  isLoading: boolean;
  isConnected: boolean;
  error: Error | null;
}

export const initialState: TapState = {
  rows: [],
  unsortedRows: [],
  sortColumn: '',
  sortDirection: 'none',
  stats: getDefaultTapEventsSummary(),
  isLoading: false,
  isConnected: false,
  error: null,
};

export const tapFeature = createFeature({
  name: 'tap',
  reducer: createReducer(
    initialState,

    on(TapActions.connectStream, (state) => ({
      ...state,
      isLoading: true,
      isConnected: false,
      error: null,
    })),

    on(TapActions.eventReceived, (state, { tap, summary }) => {
      const { sortDirection, unsortedRows, rows, sortColumn } = state;
      const shouldSort = sortDirection !== 'none';
      const unsorted = [tap, ...unsortedRows];
      let sortedRows: TapTableRow[] = [];

      if (shouldSort) {
        sortedRows = [tap, ...rows];
        sortedRows = sortTapsResponseData(sortedRows, sortColumn, sortDirection);
      }

      return {
        ...state,
        unsortedRows: unsorted,
        rows: shouldSort ? sortedRows : unsorted,
        stats: summary,
        isLoading: false,
        isConnected: true,
      };
    }),

    on(TapActions.sort, (state, { column, direction }) => {
      let sortedRows: TapTableRow[] = [];
      const { unsortedRows } = state;
      const shouldSort = direction !== 'none';

      if (shouldSort) {
        sortedRows = sortTapsResponseData([...state.unsortedRows], column, direction);
      }

      return {
        ...state,
        sortColumn: shouldSort ? column : '',
        sortDirection: direction,
        rows: shouldSort ? sortedRows : unsortedRows,
      };
    }),

    on(TapActions.streamError, (state, { error }) => ({
      ...state,
      isLoading: false,
      isConnected: false,
      error: error,
    })),

    on(TapActions.disconnectStream, (state) => ({
      ...state,
      isLoading: false,
      isConnected: false,
      rows: [],
      unsortedRows: [],
    })),
  ),
});

export const { selectRows, selectStats, selectIsLoading, selectIsConnected, selectError } = tapFeature;
