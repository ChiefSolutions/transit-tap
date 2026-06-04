import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TapRowWithStats } from '../models'; // Adjust this path if your model is elsewhere

export const TapActions = createActionGroup({
  source: 'Tap Domain',
  events: {
    // Trigger Action: Dispatched by the component to initiate the SSE stream
    'Connect Stream': emptyProps(),

    // Success/Data Action: Dispatched by the Effect every time a new SSE event arrives
    'Event Received': props<TapRowWithStats>(),

    // Failure Action: Dispatched by the Effect if the stream drops or errors out
    'Stream Error': props<{ error: Error }>(),

    // Teardown Action: Optional, used if you need to manually close the connection early
    'Disconnect Stream': emptyProps(),
  },
});
