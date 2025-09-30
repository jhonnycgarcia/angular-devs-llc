import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button.component';
import { ButtonComponentMock } from '@mocks/button.component.mock';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponentMock>;
  let hostComponent: ButtonComponentMock;
  let buttonElement: HTMLButtonElement;
  let buttonDebugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponentMock]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponentMock);
    hostComponent = fixture.componentInstance;

    buttonDebugElement = fixture.debugElement.query(By.css('button[ui-button]'));
    buttonElement = buttonDebugElement.nativeElement;
    component = buttonDebugElement.componentInstance;

    jest.spyOn(hostComponent, 'onButtonClick');

    fixture.detectChanges();
  });

  describe('Inicialización', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render with default values', () => {
      expect(component.disabled()).toBe(false);
      expect(component.size()).toBe('medium');
      expect(component.type()).toBe('button');
      expect(component.variant()).toBe('secondary');
      expect(component.ariaLabel()).toBeUndefined();
    });

    it('should display projected content', () => {
      expect(buttonElement.textContent?.trim()).toBe('Botón de Prueba');
    });
  });

  describe('Host bindings - Atributos', () => {
    it('should set type attribute correctly', () => {
      expect(buttonElement.getAttribute('type')).toBe('button');

      hostComponent.type = 'submit';
      fixture.detectChanges();
      expect(buttonElement.getAttribute('type')).toBe('submit');

      hostComponent.type = 'reset';
      fixture.detectChanges();
      expect(buttonElement.getAttribute('type')).toBe('reset');
    });

    it('should set disabled attribute when disabled is true', () => {
      expect(buttonElement.disabled).toBe(false);

      hostComponent.disabled = true;
      fixture.detectChanges();
      expect(buttonElement.disabled).toBe(true);
    });

    it('should set aria-label attribute when provided', () => {
      expect(buttonElement.getAttribute('aria-label')).toBeNull();

      hostComponent.ariaLabel = 'Test aria label';
      fixture.detectChanges();
      expect(buttonElement.getAttribute('aria-label')).toBe('Test aria label');
    });
  });

  describe('Host bindings - CSS Classes', () => {
    it('should apply variant classes correctly', () => {
      // Primary variant
      hostComponent.variant = 'primary';
      fixture.detectChanges();
      expect(buttonElement.classList.contains('primary')).toBe(true);
      expect(buttonElement.classList.contains('secondary')).toBe(false);
      expect(buttonElement.classList.contains('danger')).toBe(false);

      // Danger variant
      hostComponent.variant = 'danger';
      fixture.detectChanges();
      expect(buttonElement.classList.contains('danger')).toBe(true);
      expect(buttonElement.classList.contains('primary')).toBe(false);
      expect(buttonElement.classList.contains('secondary')).toBe(false);
    });

    it('should apply size classes correctly', () => {
      // Small size
      hostComponent.size = 'small';
      fixture.detectChanges();
      expect(buttonElement.classList.contains('small')).toBe(true);
      expect(buttonElement.classList.contains('large')).toBe(false);

      // Large size
      hostComponent.size = 'large';
      fixture.detectChanges();
      expect(buttonElement.classList.contains('large')).toBe(true);
      expect(buttonElement.classList.contains('small')).toBe(false);

      // Back to medium
      hostComponent.size = 'medium';
      fixture.detectChanges();
      expect(buttonElement.classList.contains('small')).toBe(false);
      expect(buttonElement.classList.contains('large')).toBe(false);
    });
  });

  describe('Click handling', () => {
    it('should emit buttonClick when clicked and not disabled', () => {
      buttonElement.click();

      expect(hostComponent.onButtonClick).toHaveBeenCalledTimes(1);
      expect(hostComponent.onButtonClick).toHaveBeenCalledWith(expect.any(Event));
    });

    it('should not emit buttonClick when disabled', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();

      buttonElement.click();

      expect(hostComponent.onButtonClick).not.toHaveBeenCalled();
    });

  });

  describe('Input changes', () => {
    it('should update when inputs change', () => {
      hostComponent.ariaLabel = 'New label';
      hostComponent.disabled = true;
      hostComponent.size = 'large';
      hostComponent.type = 'submit';
      hostComponent.variant = 'primary';

      fixture.detectChanges();

      expect(component.ariaLabel()).toBe('New label');
      expect(component.disabled()).toBe(true);
      expect(component.size()).toBe('large');
      expect(component.type()).toBe('submit');
      expect(component.variant()).toBe('primary');

      expect(buttonElement.getAttribute('aria-label')).toBe('New label');
      expect(buttonElement.disabled).toBe(true);
      expect(buttonElement.classList.contains('large')).toBe(true);
      expect(buttonElement.getAttribute('type')).toBe('submit');
      expect(buttonElement.classList.contains('primary')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined ariaLabel', () => {
      hostComponent.ariaLabel = undefined;
      fixture.detectChanges();

      expect(buttonElement.getAttribute('aria-label')).toBeNull();
    });

    it('should handle empty string ariaLabel', () => {
      hostComponent.ariaLabel = '';
      fixture.detectChanges();

      expect(buttonElement.getAttribute('aria-label')).toBe('');
    });

    it('should handle multiple rapid clicks when not disabled', () => {
      buttonElement.click();
      buttonElement.click();
      buttonElement.click();

      expect(hostComponent.onButtonClick).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple rapid clicks when disabled', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();

      buttonElement.click();
      buttonElement.click();
      buttonElement.click();

      expect(hostComponent.onButtonClick).not.toHaveBeenCalled();
    });
  });

  describe('ChangeDetection OnPush', () => {
    it('should work correctly with OnPush change detection strategy', () => {
      expect(fixture.componentRef.location.nativeElement.querySelector('button')).toBeTruthy();

      hostComponent.variant = 'primary';

      expect(buttonElement.classList.contains('primary')).toBe(false);

      fixture.detectChanges();
      expect(buttonElement.classList.contains('primary')).toBe(true);
    });
  });
});
