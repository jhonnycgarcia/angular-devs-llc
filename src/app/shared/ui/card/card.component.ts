import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'card',
  imports: [],
  template: `<ng-content></ng-content>`,
  host: {
    'role': 'region',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()'
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      padding: var(--space-md);
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  ariaLabel = input<string>();
  ariaLabelledBy = input<string>();
}
