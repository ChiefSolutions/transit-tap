import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { TapTableRow, TapEventsSummary, TapStatName, TableSort } from '../types';
import { TapActions } from './tap.actions';
import { getDefaultTapEventsSummary, sortTaps } from '../utils';

export interface TapState {
  filterName: TapStatName;
  rows: TapTableRow[];
  sort: TableSort;
  stats: TapEventsSummary;
  isLoading: boolean;
  isConnected: boolean;
  error: Error | null;
}

export const initialState: TapState = {
  filterName: 'Total',
  rows: [],
  sort: { column: 'deviceName', direction: 'none' },
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
    on(TapActions.eventReceived, (state, { tap, summary }): TapState => {
      const rows = [tap, ...state.rows];

      return { ...state, rows, stats: summary, isLoading: false, isConnected: true };
    }),
    on(TapActions.sort, (state, sort): TapState => ({ ...state, sort })),
    on(TapActions.filter, (state, { name }): TapState => ({ ...state, filterName: name })),
    on(TapActions.streamError, (state, { error }): TapState => ({ ...state, isLoading: false, isConnected: false, error })),
    on(TapActions.disconnectStream, (state): TapState => ({ ...state, isLoading: false, isConnected: false, rows: [] })),
  ),

  extraSelectors: ({ selectRows, selectFilterName, selectSort }) => ({
    selectRows: createSelector(selectRows, selectFilterName, selectSort, (rows, filterName, sort) => {
      const shouldFilter = !!filterName && filterName !== 'Total';
      const shouldSort = sort && sort.direction !== 'none';

      let processedRows = shouldFilter ? rows.filter((row) => row.event === filterName || row.status === filterName) : [...rows];

      if (shouldSort) {
        processedRows = sortTaps(processedRows, sort);
      }

      return processedRows;
    }),
  }),
});

export const { selectRows, selectStats, selectIsLoading, selectIsConnected, selectError } = tapFeature;
