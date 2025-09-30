import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'success-icon',
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
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessIconComponent {
  @Input() size: number = 24;
}
