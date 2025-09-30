import { Component } from '@angular/core';
import { AlertComponent } from '@shared/ui/alert/alert.component';

@Component({
  template: `
    <app-alert [type]="type">
      Alerta de Prueba
    </app-alert>
  `,
  imports: [AlertComponent]
})
export class AlertComponentMock {
  type: 'success' | 'danger' = 'success';
}
