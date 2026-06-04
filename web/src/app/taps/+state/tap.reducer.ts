import { createFeature, createReducer, on } from '@ngrx/store';
import { TapTableRow, TapEventsSummary } from '../models';
import { TapActions } from './tap.actions';
import { getDefaultTapEventsSummary } from '../utils';

export interface State {
  rows: TapTableRow[];
  stats: TapEventsSummary;
  isLoading: boolean;
  isConnected: boolean;
  error: Error | null;
}

export const initialState: State = {
  rows: [],
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

    on(TapActions.eventReceived, (state, { tap, summary }) => ({
      ...state,
      rows: [...state.rows, tap],
      stats: summary,
      isLoading: false,
      isConnected: true,
      error: null,
    })),

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
    })),
  ),
});

export const { selectRows, selectStats, selectIsLoading, selectIsConnected, selectError } =
  tapFeature;
