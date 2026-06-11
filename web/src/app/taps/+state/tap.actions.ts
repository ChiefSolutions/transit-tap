import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TapRowWithStats, TableSort, TapStatName } from '../types';

export const TapActions = createActionGroup({
  source: 'Tap Domain',
  events: {
    connectStream: emptyProps(),
    eventReceived: props<TapRowWithStats>(),
    sort: props<TableSort>(),
    filter: props<{ name: TapStatName }>(),
    streamError: props<{ error: Error }>(),
    disconnectStream: emptyProps(),
  },
});
