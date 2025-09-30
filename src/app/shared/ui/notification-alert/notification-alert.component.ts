import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessIconComponent } from '../success-icon/success-icon.component';
import { ErrorIconComponent } from '../error-icon/error-icon.component';

@Component({
  selector: 'app-notification-alert',
  templateUrl: './notification-alert.component.html',
  styleUrls: ['./notification-alert.component.scss'],
  imports: [CommonModule, SuccessIconComponent, ErrorIconComponent]
})
export class NotificationAlertComponent {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'success';
  @Input() message: string = '';

  get alertType(): 'success' | 'danger' {
    return this.type === 'success' || this.type === 'info' ? 'success' : 'danger';
  }

  get title(): string {
    switch (this.type) {
      case 'success':
        return 'Éxito';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Advertencia';
      case 'info':
        return 'Información';
      default:
        return 'Notificación';
    }
  }

  get iconSize(): number {
    return 24;
  }
}
