import { createFeature, createReducer, on } from '@ngrx/store';
import { TapTableRow, TapEventsSummary, SortDirection } from '../models';
import { TapActions } from './tap.actions';
import { getDefaultTapEventsSummary, sortRows } from '../utils';

export interface State {
  rows: TapTableRow[];
  sortColumn: keyof TapTableRow;
  unsortedRows: TapTableRow[];
  sortDirection: SortDirection;
  stats: TapEventsSummary;
  isLoading: boolean;
  isConnected: boolean;
  error: Error | null;
}

export const initialState: State = {
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
      const nextUnsorted = [tap, ...state.unsortedRows];
      let nextDisplayRows: TapTableRow[];

      if (nextUnsorted.length > 200) {
        nextUnsorted.length = 200;
      }

      if (state.sortDirection === 'none') {
        nextDisplayRows = nextUnsorted;
      } else {
        const activeColumn = state.sortColumn;

        nextDisplayRows = [tap, ...state.rows];

        if (nextDisplayRows.length > 200) {
          nextDisplayRows.length = 200;
        }

        nextDisplayRows = sortRows(nextDisplayRows, activeColumn, state.sortDirection);
      }

      return {
        ...state,
        unsortedRows: nextUnsorted,
        rows: nextDisplayRows,
        stats: summary,
        isLoading: false,
        isConnected: true,
        error: null,
      };
    }),

    on(TapActions.sort, (state, { column, direction }) => {
      if (direction === 'none') {
        return {
          ...state,
          sortColumn: '',
          sortDirection: direction,
          rows: state.unsortedRows,
        };
      }

      const sortedRows = sortRows([...state.unsortedRows], column, direction);

      return {
        ...state,
        sortColumn: column,
        sortDirection: direction,
        rows: sortedRows,
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

export const { selectRows, selectStats, selectIsLoading, selectIsConnected, selectError } =
  tapFeature;
