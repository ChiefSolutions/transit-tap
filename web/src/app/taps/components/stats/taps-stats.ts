import { Component, input, computed } from '@angular/core';
import { TapStat, TapEventsSummary } from '../../types';
import { getDefaultTapEventsSummary } from '../../utils';

@Component({
  selector: 'app-taps-stats',
  imports: [],
  templateUrl: './taps-stats.html',
  styleUrl: './taps-stats.scss',
})
export class TapsStats {
  public readonly summary = input.required<TapEventsSummary>();

  defaultStats: TapEventsSummary = getDefaultTapEventsSummary();

  // Single computed signal that derives everything in one pass
  public readonly statsSummary = computed(() => {
    const data = this.summary() ?? this.defaultStats;

    // Map UI array structure
    const stats: TapStat[] = [
      { label: 'Total events', value: data.total },
      { label: 'Tap ins', value: data.tapIns },
      { label: 'Tap outs', value: data.tapOuts },
      { label: 'Declined', value: data.declined },
    ];

    return { stats, errorCount: data.errors };
  });

  // Expose clean, discrete properties for your template to retain compatibility
  public readonly stats = computed(() => this.statsSummary().stats);
  // public readonly errorCount = computed(() => this.statsSummary().errorCount);
}
