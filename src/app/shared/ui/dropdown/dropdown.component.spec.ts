import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let spectator: Spectator<DropdownComponent>;

  const createComponent = createComponentFactory({
    component: DropdownComponent,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('Default values', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have default options', () => {
      expect(spectator.component.options()).toEqual([]);
    });

    it('should have default emptyOptions', () => {
      expect(spectator.component.emptyOptions()).toBe('No hay opciones disponibles');
    });

    it('should have default ariaLabel', () => {
      expect(spectator.component.ariaLabel()).toBe('Menú de opciones');
    });

    it('should have isOpen signal defaulting to false', () => {
      expect(spectator.component.isOpen()).toBe(false);
    });

    it('should have position signal defaulting to below', () => {
      expect(spectator.component.position()).toBe('below');
    });
  });

  describe('Template rendering', () => {
    it('should render button with ellipsis icon', () => {
      const button = spectator.query('button');
      expect(button).toBeTruthy();

      const icon = spectator.query('ellipsis-icon');
      expect(icon).toBeTruthy();
    });

    it('should not render options list when closed', () => {
      const optionsList = spectator.query('ul.options');
      expect(optionsList).toBeFalsy();
    });

    it('should render options list when open', () => {
      spectator.component.isOpen.set(true);
      spectator.detectChanges();

      const optionsList = spectator.query('ul.options');
      expect(optionsList).toBeTruthy();
    });

    it('should render options when provided', () => {
      spectator.setInput('options', ['Option 1', 'Option 2', 'Option 3']);
      spectator.component.isOpen.set(true);
      spectator.detectChanges();

      const options = spectator.queryAll('li[role="menuitem"]');
      expect(options.length).toBe(3);
      expect(options[0]?.textContent?.trim()).toBe('Option 1');
      expect(options[1]?.textContent?.trim()).toBe('Option 2');
      expect(options[2]?.textContent?.trim()).toBe('Option 3');
    });

    it('should render empty message when no options', () => {
      spectator.component.isOpen.set(true);
      spectator.detectChanges();

      const emptyOption = spectator.query('li[aria-disabled]');
      expect(emptyOption).toBeTruthy();
      expect(emptyOption?.textContent?.trim()).toBe('No hay opciones disponibles');
    });

    it('should apply position class to options list', () => {
      spectator.setInput('options', ['Option 1']);
      spectator.component.isOpen.set(true);
      spectator.component.position.set('above');
      spectator.detectChanges();

      const optionsList = spectator.query('ul.options');
      expect(optionsList?.classList.contains('above')).toBe(true);
    });
  });

  describe('Button attributes', () => {
    it('should set aria-expanded to false when closed', () => {
      const button = spectator.query('button');
      expect(button?.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-expanded to true when open', () => {
      spectator.component.isOpen.set(true);
      spectator.detectChanges();

      const button = spectator.query('button');
      expect(button?.getAttribute('aria-expanded')).toBe('true');
    });


    it('should have aria-haspopup menu', () => {
      const button = spectator.query('button');
      expect(button?.getAttribute('aria-haspopup')).toBe('menu');
    });
  });

  describe('Toggle functionality', () => {
    it('should toggle isOpen when toggle is called', () => {
      expect(spectator.component.isOpen()).toBe(false);

      spectator.component.toggle();
      expect(spectator.component.isOpen()).toBe(true);

      spectator.component.toggle();
      expect(spectator.component.isOpen()).toBe(false);
    });
  });

  describe('Selection functionality', () => {
    it('should emit select and close dropdown when option is selected', () => {
      const outputSpy = jest.fn();
      spectator.component.select.subscribe(outputSpy);
      spectator.setInput('options', ['Option 1', 'Option 2']);

      spectator.component.onSelect('Option 1');

      expect(outputSpy).toHaveBeenCalledWith('Option 1');
      expect(spectator.component.isOpen()).toBe(false);
    });
  });

  describe('Keyboard interactions', () => {
    it('should toggle on Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spectator.component.onKeyDown(event);

      expect(spectator.component.isOpen()).toBe(true);
    });

    it('should toggle on Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      spectator.component.onKeyDown(event);

      expect(spectator.component.isOpen()).toBe(true);
    });

  });


  describe('Escape key handling', () => {
    it('should close dropdown on escape key', () => {
      spectator.component.isOpen.set(true);

      const event = new KeyboardEvent('keydown');
      spectator.component.onEscapeKey(event);

      expect(spectator.component.isOpen()).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on options list', () => {
      spectator.setInput('options', ['Option 1']);
      spectator.component.isOpen.set(true);
      spectator.detectChanges();

      const optionsList = spectator.query('ul.options');
      expect(optionsList?.getAttribute('role')).toBe('menu');
      expect(optionsList?.getAttribute('aria-label')).toBe('Menú de opciones');
    });

    it('should have proper ARIA attributes on menu items', () => {
      spectator.setInput('options', ['Option 1']);
      spectator.component.isOpen.set(true);
      spectator.detectChanges();

      const menuItems = spectator.queryAll('li[role="menuitem"]');
      expect(menuItems.length).toBe(1);
      expect(menuItems[0]?.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('Input changes', () => {
    it('should update ariaLabel when input changes', () => {
      spectator.setInput('ariaLabel', 'Custom menu');
      spectator.detectChanges();

      const button = spectator.query('button');
      expect(button?.getAttribute('aria-label')).toBe('Custom menu');
    });

    it('should update emptyOptions when input changes', () => {
      spectator.setInput('emptyOptions', 'No items found');
      spectator.component.isOpen.set(true);
      spectator.detectChanges();

      const emptyOption = spectator.query('li[aria-disabled]');
      expect(emptyOption?.textContent?.trim()).toBe('No items found');
    });
  });
});
