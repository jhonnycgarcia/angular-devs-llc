import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'plus-icon',
  imports: [],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      [style.width]="size + 'px'"
      [style.height]="size + 'px'"
      [class]="'size-' + size"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusIconComponent {
  @Input() size: number = 24;
}
