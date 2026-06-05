import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-taps-list-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class TapsListHeader {
  @Input() connected = false;
}
