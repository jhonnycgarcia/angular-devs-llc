import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MoneyIconComponent } from '@shared/ui/money-icon/money-icon.component';

@Component({
  selector: 'ui-header',
  imports: [MoneyIconComponent],
  template: `
    <money-icon [size]="24" [attr.aria-hidden]="true" data-testid="header-money-icon" />
    <h1 data-testid="header-title">{{ title() }}</h1>
  `,
  host: {
    'role': 'banner'
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      height: 60px;
    }

    h1 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  title = input.required<string>();
}
