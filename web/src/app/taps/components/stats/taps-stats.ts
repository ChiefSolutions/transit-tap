import { Component, input, computed, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TapStat, TapEventsSummary, TapStatName } from '../../types';
import { getDefaultTapEventsSummary } from '../../utils';
import { Icon } from '../../../components';
import { NgClass } from '@angular/common';
import { DonutMiniChart } from '../../../components';

@Component({
  selector: 'app-taps-stats',
  imports: [Icon, NgClass, DonutMiniChart],
  templateUrl: './taps-stats.html',
  styleUrl: './taps-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TapsStats {
  public readonly summary = input.required<TapEventsSummary>();
  @Output() filterTable = new EventEmitter<{ name: TapStatName; event: Event }>();

  private _defaultStats: TapEventsSummary = getDefaultTapEventsSummary();

  public readonly statsSummary = computed(() => {
    const data = this.summary() ?? this._defaultStats;

    const stats: TapStat[] = [
      { label: 'Total events', value: data.total, icon: 'stacks', name: 'Total' },
      { label: 'Tap ins', value: data.tapIns, icon: 'login', name: 'TapIn' },
      { label: 'Tap outs', value: data.tapOuts, icon: 'logout', name: 'TapOut' },
      { label: 'Declined', value: data.declined, icon: 'block', name: 'Declined' },
    ];

    return { stats, errorCount: data.errors };
  });

  public readonly stats = computed(() => this.statsSummary().stats);

  public getCssClass(): Record<string, string> {
    return {
      TapIn: 'TapsStats--in',
      TapOut: 'TapsStats--out',
      Declined: 'TapsStats--declined',
    };
  }

  public getChartCssClass(): Record<string, string> {
    return {
      TapIn: 'TapsStats--chartIn',
      TapOut: 'TapsStats--chartOut',
      Declined: 'TapsStats--chartDeclined',
    };
  }
}
