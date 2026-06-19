import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TapTableRow } from '../../types';
import { DatePipe } from '@angular/common';
import { TapEventLabelMap } from '../../../constants';

@Component({
  selector: 'app-tap-row',
  imports: [DatePipe],
  templateUrl: './taps-row.html',
  styleUrl: './taps-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TapsRow {
  public readonly data = input.required<TapTableRow>();
  protected readonly TapEventLabelMap = TapEventLabelMap;
}
