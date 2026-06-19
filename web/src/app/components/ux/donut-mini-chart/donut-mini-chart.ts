import { Component, computed, input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { CIRCUMFERENCE, GAP } from '../../../constants';

@Component({
  selector: 'app-donut-mini-chart',
  standalone: true,
  templateUrl: 'donut-mini-chart.html',
  styleUrls: ['./donut-mini-chart.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    '[attr.aria-label]': '`Statistics summaries for tap events`',
  },
})
export class DonutMiniChart {
  initial = input<number>(0);
  total = input<number>(0);
  size = input<number>(80);
  progressCssClass = input<string>('');

  protected inPct = computed(() => {
    const t = this.total();
    return t > 0 ? Math.min(1, Math.max(0, this.initial() / t)) : 0;
  });

  protected outPct = computed(() => 1 - this.inPct());

  protected pctLabel = computed(() => `${Math.round(this.inPct() * 100)}%`);

  protected ariaLabel = computed(() => `Donut chart: ${this.pctLabel()} tap-in, ${Math.round(this.outPct() * 100)}% tap-out`);

  protected inDash = computed(() => {
    const visible = Math.max(0, this.inPct() * CIRCUMFERENCE - GAP);
    return `${visible} ${CIRCUMFERENCE - visible}`;
  });

  protected outDash = computed(() => {
    const visible = Math.max(0, this.outPct() * CIRCUMFERENCE - GAP);
    return `${visible} ${CIRCUMFERENCE - visible}`;
  });

  protected outTransform = computed(() => {
    const startDeg = -90 + this.inPct() * 360;
    return `rotate(${startDeg} 100 100)`;
  });
}
