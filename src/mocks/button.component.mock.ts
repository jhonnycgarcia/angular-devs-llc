import { Component } from '@angular/core';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  template: `
    <button
      ui-button
      [ariaLabel]="ariaLabel"
      [disabled]="disabled"
      [size]="size"
      [type]="type"
      [variant]="variant"
      (buttonClick)="onButtonClick($event)">
      Botón de Prueba
    </button>
  `,
  imports: [ButtonComponent]
})
export class ButtonComponentMock {
  ariaLabel?: string;
  disabled = false;
  size: 'small' | 'medium' | 'large' = 'medium';
  type: 'button' | 'submit' | 'reset' = 'button';
  variant: 'primary' | 'secondary' | 'danger' = 'secondary';

  onButtonClick = (event: Event) => {};
}
