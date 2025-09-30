import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ui-skeleton',
  imports: [],
  template: `
    <span
      class="placeholder"
      [style.width]="width"
      [style.height]="getHeight()"
      data-testid="skeleton-placeholder"
    ></span>
  `,
  styles: `
    :host {
      display: block;
    }

    .placeholder {
      display: block;
      min-height: 1em;
      vertical-align: middle;
      cursor: wait;
      background-color: var(--color-gray-500);
      opacity: .5;
      animation: placeholder-glow 2s ease-in-out infinite;
    }

    @keyframes placeholder-glow {
      0%, 100% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '1em';
  @Input() size: 'small' | 'medium' | 'large' | 'custom' = 'medium';

  getHeight(): string {
    if (this.size === 'custom') {
      return this.height;
    }
    switch (this.size) {
      case 'small':
        return '0.5em';
      case 'medium':
        return '1em';
      case 'large':
        return '1.5em';
      default:
        return '1em';
    }
  }
}
