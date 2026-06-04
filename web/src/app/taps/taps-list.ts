import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TapsStats } from './components/stats/taps-stats';
import { Store } from '@ngrx/store';
import {
  selectRows,
  selectError,
  selectIsLoading,
  selectIsConnected,
  selectStats,
} from './+state/tap.reducer';
import { TapActions } from './+state/tap.actions';
import { TapsRow } from './components/row/taps-row';
import { TapTableRow, TapEventsSummary } from './models';

@Component({
  selector: 'app-tap-list',
  imports: [TapsStats, TapsRow],
  templateUrl: './taps-list.html',
  styleUrl: './taps-list.scss',
})
export class TapsList implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  // Expose the NgRx state directly as readonly signals
  public readonly rowsSignal = this.store.selectSignal<TapTableRow[]>(selectRows);
  public readonly summarySignal = this.store.selectSignal<TapEventsSummary>(selectStats);
  public readonly isLoading = this.store.selectSignal(selectIsLoading);
  public readonly isConnected = this.store.selectSignal(selectIsConnected);
  public readonly errorSignal = this.store.selectSignal(selectError);
  public columnNames = ['Device Name', 'Timestamp', 'Event', 'Status'];

  public ngOnInit(): void {
    // Kick off the SSE stream connection via NgRx Effects
    this.store.dispatch(TapActions.connectStream());
  }

  public ngOnDestroy(): void {
    // Cleanly tear down the stream if the user navigates away
    this.store.dispatch(TapActions.disconnectStream());
  }
}
