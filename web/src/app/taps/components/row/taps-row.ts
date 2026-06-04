import { Component, input } from '@angular/core';
import { TapTableRow } from '../../models';
import { DatePipe } from '@angular/common';
import { TapEventLabelMap } from '../../../constants';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'tr[app-tap-row]',
  imports: [DatePipe],
  templateUrl: './taps-row.html',
  styleUrl: './taps-row.scss',
})
export class TapsRow {
  // Required read-only signal input from the parent container
  public readonly data = input.required<TapTableRow>();
  protected readonly TapEventLabelMap = TapEventLabelMap;
}
