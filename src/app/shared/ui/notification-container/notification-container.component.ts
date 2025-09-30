import { Component, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../data/notification.service';
import { NotificationAlertComponent } from '../notification-alert/notification-alert.component';

@Component({
  selector: 'app-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss'],
  imports: [CommonModule, NotificationAlertComponent]
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  private autoDismissTimers = new Map<string, number>();

  constructor(private notificationService: NotificationService) {}

  // Computed signal to get current notifications
  notifications = computed(() => this.notificationService.notifications$());

  ngOnInit(): void {
    // Auto-dismiss notifications after 4 seconds for success/error, 6 seconds for info/warning
  }

  onCloseNotification(id: string): void {
    this.clearAutoDismissTimer(id);
    this.notificationService.removeNotification(id);
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }

  ngOnDestroy(): void {
    // Clear all auto-dismiss timers
    this.autoDismissTimers.forEach(timer => clearTimeout(timer));
    this.autoDismissTimers.clear();
  }

  private clearAutoDismissTimer(id: string): void {
    const timer = this.autoDismissTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.autoDismissTimers.delete(id);
    }
  }
}
