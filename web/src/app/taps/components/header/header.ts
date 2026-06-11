import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Icon } from '../../../components';

@Component({
  selector: 'app-taps-list-header',
  imports: [Icon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TapsListHeader {
  @Input() connected = false;
}
