import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'ui-logo',
  imports: [NgOptimizedImage],
  template: `
    <img
      ngSrc="{{src}}"
      alt="Avatar"
      fill
      data-testid="logo-image"
    />
  `,
  styles: `
    :host {
      display: inline-block;
      position: relative;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  @Input() src: string = '';
}
