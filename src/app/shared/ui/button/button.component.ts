
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'button[ui-button]',
  template: `<ng-content />`,
  host: {
    '[attr.type]': 'type()',
    '[class.primary]': 'variant() === "primary"',
    '[class.secondary]': 'variant() === "secondary"',
    '[class.danger]': 'variant() === "danger"',
    '[class.small]': 'size() === "small"',
    '[class.large]': 'size() === "large"',
    '[disabled]': 'disabled()',
    '[attr.aria-label]': 'ariaLabel()',
    '(click)': 'handleClick($event)',
  },
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  ariaLabel = input<string>();
  disabled = input(false);
  size = input<'small' | 'medium' | 'large'>('medium');
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'danger'>('secondary');

  buttonClick = output<Event>();

  handleClick(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.buttonClick.emit(event);
  }
}
