import { TestBed } from '@angular/core/testing';
import { NotificationService, Notification } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty notifications', () => {
    const notifications = service.notifications$();
    expect(notifications).toEqual([]);
  });

  describe('showSuccess', () => {
    it('should add a success notification with default duration', () => {
      const message = 'Success message';
      service.showSuccess(message);

      const notifications = service.notifications$();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe('success');
      expect(notifications[0].message).toBe(message);
      expect(notifications[0].duration).toBe(5000);
      expect(notifications[0].id).toBeDefined();
    });

    it('should add a success notification with custom duration', () => {
      const message = 'Success message';
      const duration = 3000;
      service.showSuccess(message, duration);

      const notifications = service.notifications$();
      expect(notifications[0].duration).toBe(duration);
    });
  });

  describe('showError', () => {
    it('should add an error notification with default duration', () => {
      const message = 'Error message';
      service.showError(message);

      const notifications = service.notifications$();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe('error');
      expect(notifications[0].message).toBe(message);
      expect(notifications[0].duration).toBe(8000);
    });
  });

  describe('showWarning', () => {
    it('should add a warning notification with default duration', () => {
      const message = 'Warning message';
      service.showWarning(message);

      const notifications = service.notifications$();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe('warning');
      expect(notifications[0].message).toBe(message);
      expect(notifications[0].duration).toBe(6000);
    });
  });

  describe('showInfo', () => {
    it('should add an info notification with default duration', () => {
      const message = 'Info message';
      service.showInfo(message);

      const notifications = service.notifications$();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe('info');
      expect(notifications[0].message).toBe(message);
      expect(notifications[0].duration).toBe(5000);
    });
  });

  describe('removeNotification', () => {
    it('should remove a notification by ID', () => {
      service.showSuccess('Test message');
      const notifications = service.notifications$();
      const idToRemove = notifications[0].id;

      service.removeNotification(idToRemove);

      const updatedNotifications = service.notifications$();
      expect(updatedNotifications).toHaveLength(0);
    });

    it('should not remove any notification if ID does not exist', () => {
      service.showSuccess('Test message');
      service.removeNotification('non-existent-id');

      const notifications = service.notifications$();
      expect(notifications).toHaveLength(1);
    });
  });

  describe('clearAll', () => {
    it('should remove all notifications', () => {
      service.showSuccess('Message 1');
      service.showError('Message 2');
      service.showWarning('Message 3');

      expect(service.notifications$()).toHaveLength(3);

      service.clearAll();

      expect(service.notifications$()).toHaveLength(0);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      service.showSuccess('Message 1');
      service.showSuccess('Message 2');

      const notifications = service.notifications$();
      expect(notifications[0].id).not.toBe(notifications[1].id);
    });

    it('should generate IDs with correct format', () => {
      service.showSuccess('Test message');
      const notifications = service.notifications$();
      const id = notifications[0].id;

      expect(id).toMatch(/^[a-z0-9]{7}$/);
    });
  });

  describe('auto-removal', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should auto-remove notification after duration', () => {
      const duration = 1000;
      service.showSuccess('Test message', duration);

      expect(service.notifications$()).toHaveLength(1);

      jest.advanceTimersByTime(duration);

      expect(service.notifications$()).toHaveLength(0);
    });

    it('should not auto-remove if duration is 0', () => {
      service.showSuccess('Test message', 0);

      expect(service.notifications$()).toHaveLength(1);

      jest.advanceTimersByTime(5000);

      expect(service.notifications$()).toHaveLength(1);
    });

    it('should handle multiple notifications with different durations', () => {
      service.showSuccess('Message 1', 1000);
      service.showError('Message 2', 2000);

      expect(service.notifications$()).toHaveLength(2);

      jest.advanceTimersByTime(1000);

      expect(service.notifications$()).toHaveLength(1);
      expect(service.notifications$()[0].message).toBe('Message 2');

      jest.advanceTimersByTime(1000);

      expect(service.notifications$()).toHaveLength(0);
    });
  });

  describe('notifications$ signal', () => {
    it('should be read-only', () => {
      const notifications$ = service.notifications$;

      // Should not be able to modify directly
      expect(() => {
        (notifications$ as any).set([]);
      }).toThrow();
    });

    it('should reflect changes from service methods', () => {
      expect(service.notifications$()).toHaveLength(0);

      service.showSuccess('Test message');
      expect(service.notifications$()).toHaveLength(1);

      service.clearAll();
      expect(service.notifications$()).toHaveLength(0);
    });
  });
});
