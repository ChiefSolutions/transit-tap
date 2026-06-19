import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';
import { ICONS } from '../../../constants';
import { IconKey } from '../../../constants/types';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  template: '',
  host: {
    '[innerHTML]': 'svgContent()', // The SVG replaces the inner content safely
  },
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  name = input.required<IconKey>();

  private _sanitizer = inject(DomSanitizer);

  svgContent = computed<SafeHtml>(() => {
    const iconName = this.name();
    const icon = ICONS[iconName];

    if (icon) {
      const purified = DOMPurify.sanitize(icon, {
        USE_PROFILES: { svg: true },
      });

      return this._sanitizer.bypassSecurityTrustHtml(purified);
    }

    console.warn(`Icon "${iconName}" could not be found.`);
    return '';
  });
}
