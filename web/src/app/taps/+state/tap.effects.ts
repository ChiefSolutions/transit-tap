import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TapEventsService } from '../services/tap-events.service';
import { TapActions } from './tap.actions';
import { map, mergeMap, catchError, of, takeUntil } from 'rxjs';

@Injectable()
export class TapEffects {
  private actions$ = inject(Actions);
  private tapService = inject(TapEventsService);

  connectTapStream$ = createEffect(() =>
    this.actions$.pipe(
      // Listen specifically for the connect command
      ofType(TapActions.connectStream),

      // mergeMap keeps the long-running SSE observable active
      mergeMap(() =>
        this.tapService.getEvents().pipe(
          // Map every incoming row to our Success Action
          map(({ tap, summary }) => TapActions.eventReceived({ tap, summary })),

          // Catch any connection failures and dispatch the Error Action
          catchError((error) => of(TapActions.streamError({ error }))),

          // Instantly kill the stream connection if Disconnect is fired
          takeUntil(this.actions$.pipe(ofType(TapActions.disconnectStream))),
        ),
      ),
    ),
  );
}
