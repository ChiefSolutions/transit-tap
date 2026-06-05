import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() public text = 'Button';
  @Input() public onClick: () => void = () => {
    /* Default no-op handler */
  };
}
