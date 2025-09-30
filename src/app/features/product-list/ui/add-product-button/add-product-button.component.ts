import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent, PlusIconComponent } from '@shared/ui';

@Component({
  selector: 'add-product-button',
  imports: [
    ButtonComponent,
    PlusIconComponent,
    RouterLink,
  ],
  template: `
    <button
      ui-button
      size="large"
      [ariaLabel]="'Agregar nuevo producto'"
      routerLink="register"
      data-testid="add-product-button"
    >
      <plus-icon
        [size]="20"
        [attr.aria-hidden]="true"
        data-testid="add-product-icon"
      />
      Agregar
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductButtonComponent { }
