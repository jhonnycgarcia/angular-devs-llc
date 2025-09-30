import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationContainerComponent } from './notification-container.component';
import { NotificationService } from '../../data/notification.service';

describe('NotificationContainerComponent', () => {
  let component: NotificationContainerComponent;
  let fixture: ComponentFixture<NotificationContainerComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationContainerComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display notifications from service', () => {
    // Add test notifications
    notificationService.showSuccess('Test success message');
    notificationService.showError('Test error message');

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const notifications = compiled.querySelectorAll('app-notification-alert');

    expect(notifications.length).toBe(2);

    // Check that both notification types are displayed by checking CSS classes
    const successNotification = compiled.querySelector('.notification-alert.success');
    const errorNotification = compiled.querySelector('.notification-alert.danger');

    expect(successNotification).toBeTruthy();
    expect(errorNotification).toBeTruthy();

    // Verify the content is displayed
    const successMessage = successNotification?.querySelector('.notification-message');
    const errorMessage = errorNotification?.querySelector('.notification-message');

    expect(successMessage?.textContent?.trim()).toBe('Test success message');
    expect(errorMessage?.textContent?.trim()).toBe('Test error message');
  });

  it('should call removeNotification when close button is clicked', () => {
    jest.spyOn(notificationService, 'removeNotification');

    // Add a test notification
    notificationService.showSuccess('Test message');
    fixture.detectChanges();

    // Get the first close button and click it
    const compiled = fixture.nativeElement as HTMLElement;
    const closeButton = compiled.querySelector('.close-button') as HTMLElement;

    expect(closeButton).toBeTruthy();

    if (closeButton) {
      closeButton.click();
    }

    expect(notificationService.removeNotification).toHaveBeenCalled();
  });

  it('should track notifications by ID', () => {
    // Add a test notification
    notificationService.showSuccess('Test message');
    fixture.detectChanges();

    const notifications = component.notifications();
    expect(notifications.length).toBe(1);

    const firstNotification = notifications[0];
    const trackedId = component.trackByNotificationId(0, firstNotification);

    expect(trackedId).toBe(firstNotification.id);
  });

  it('should display empty state when no notifications', () => {
    // Ensure no notifications
    notificationService.clearAll();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const notifications = compiled.querySelectorAll('app-notification-alert');

    expect(notifications.length).toBe(0);
  });
});
