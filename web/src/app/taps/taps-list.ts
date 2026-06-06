import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { TapsStats, TapsListTable } from './components';
import { Store } from '@ngrx/store';
import { selectRows, selectError, selectIsLoading, selectIsConnected, selectStats } from './+state/tap.reducer';
import { TapActions } from './+state/tap.actions';
import { TapTableRow, TapEventsSummary, TableSort } from './types';
import { TapsListHeader } from './components';

@Component({
  selector: 'app-tap-list',
  imports: [TapsStats, TapsListHeader, TapsListTable],
  templateUrl: './taps-list.html',
  styleUrl: './taps-list.scss',
})
export class TapsList implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  public readonly rowsSignal: Signal<TapTableRow[]> = this.store.selectSignal<TapTableRow[]>(selectRows);

  public readonly summarySignal: Signal<TapEventsSummary> = this.store.selectSignal<TapEventsSummary>(selectStats);

  public readonly isLoading: Signal<boolean> = this.store.selectSignal(selectIsLoading);
  public readonly isConnected: Signal<boolean> = this.store.selectSignal(selectIsConnected);
  public readonly errorSignal: Signal<Error | null> = this.store.selectSignal(selectError);

  public ngOnInit(): void {
    this.store.dispatch(TapActions.connectStream());
  }

  public ngOnDestroy(): void {
    this.store.dispatch(TapActions.disconnectStream());
  }

  public onSortChange({ column, direction }: TableSort) {
    this.store.dispatch(TapActions.sort({ column, direction }));
  }
}
