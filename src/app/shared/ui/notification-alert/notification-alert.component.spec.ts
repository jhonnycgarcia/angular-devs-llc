import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationAlertComponent } from './notification-alert.component';

describe('NotificationAlertComponent', () => {
  let component: NotificationAlertComponent;
  let fixture: ComponentFixture<NotificationAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.type).toBe('success');
    expect(component.message).toBe('');
    expect(component.alertType).toBe('success');
    expect(component.title).toBe('Éxito');
    expect(component.iconSize).toBe(24);
  });

  it('should show success alert with correct title and icon', () => {
    component.type = 'success';
    component.message = 'Operación exitosa';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.notification-title')?.textContent).toContain('Éxito');
    expect(compiled.querySelector('success-icon')).toBeTruthy();
    expect(compiled.querySelector('error-icon')).toBeFalsy();
  });

  it('should show error alert with correct title and icon', () => {
    component.type = 'error';
    component.message = 'Error en la operación';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.notification-title')?.textContent).toContain('Error');
    expect(compiled.querySelector('error-icon')).toBeTruthy();
    expect(compiled.querySelector('success-icon')).toBeFalsy();
  });

  it('should display the message correctly', () => {
    component.message = 'Mensaje de prueba';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.notification-message')?.textContent).toContain('Mensaje de prueba');
  });

  it('should map success type to success alert type', () => {
    component.type = 'success';
    expect(component.alertType).toBe('success');
  });

  it('should map error type to danger alert type', () => {
    component.type = 'error';
    expect(component.alertType).toBe('danger');
  });
});
