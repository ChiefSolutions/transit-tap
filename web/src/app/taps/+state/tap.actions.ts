import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TapRowWithStats, TableSort } from '../models';

export const TapActions = createActionGroup({
  source: 'Tap Domain',
  events: {
    connectStream: emptyProps(),
    eventReceived: props<TapRowWithStats>(),
    sort: props<TableSort>(),
    streamError: props<{ error: Error }>(),
    disconnectStream: emptyProps(),
  },
});
