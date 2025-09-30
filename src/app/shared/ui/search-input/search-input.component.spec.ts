import { Spectator, createComponentFactory, byTestId } from '@ngneat/spectator/jest';

import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
  let spectator: Spectator<SearchInputComponent>;

  const createComponent = createComponentFactory({
    component: SearchInputComponent,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('Inicialización', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have default inputs', () => {
      expect(spectator.component.value()).toBe('');
      expect(spectator.component.label()).toBe('Etiqueta de búsqueda');
      expect(spectator.component.placeholder()).toBe('Marcador de posición de búsqueda');
      expect(spectator.component.ariaLabel()).toBe('Entrada de búsqueda');
    });
  });

  describe('Input rendering', () => {
    it('should render input with default value', () => {
      const input = spectator.query(byTestId('search-input')) as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.value).toBe('');
    });

    it('should render input with provided value', () => {
      spectator.setInput('value', 'test search');
      spectator.detectChanges();

      const input = spectator.query(byTestId('search-input')) as HTMLInputElement;
      expect(input.value).toBe('test search');
    });

    it('should render input with correct placeholder', () => {
      spectator.setInput('placeholder', 'Buscar productos');
      spectator.detectChanges();

      const input = spectator.query(byTestId('search-input')) as HTMLInputElement;
      expect(input.placeholder).toBe('Buscar productos');
    });

    it('should render input with correct aria-label', () => {
      spectator.setInput('ariaLabel', 'Buscar producto');
      spectator.detectChanges();

      const input = spectator.query(byTestId('search-input')) as HTMLInputElement;
      expect(input.getAttribute('aria-label')).toBe('Buscar producto');
    });
  });

  describe('Label rendering', () => {
    it('should render label with default text', () => {
      const label = spectator.query('label');
      expect(label?.textContent?.trim()).toBe('Etiqueta de búsqueda');
    });

    it('should render label with provided text', () => {
      spectator.setInput('label', 'Buscar Producto');
      spectator.detectChanges();

      const label = spectator.query('label');
      expect(label?.textContent?.trim()).toBe('Buscar Producto');
    });

    it('should have correct for attribute', () => {
      const label = spectator.query('label');
      expect(label?.getAttribute('for')).toBe('product-search');
    });

    it('should have sr-only class', () => {
      const label = spectator.query('label');
      expect(label?.classList.contains('sr-only')).toBe(true);
    });
  });

  describe('Input interactions', () => {
    it('should emit onInputChange when input value changes', () => {
      const inputSpy = jest.spyOn(spectator.component.onInputChange, 'emit');

      const input = spectator.query(byTestId('search-input')) as HTMLInputElement;
      spectator.typeInElement('new search value', input);

      expect(inputSpy).toHaveBeenCalledWith('new search value');
    });

    it('should emit onInputChange with empty string when input is cleared', () => {
      const inputSpy = jest.spyOn(spectator.component.onInputChange, 'emit');

      const input = spectator.query(byTestId('search-input')) as HTMLInputElement;
      spectator.typeInElement('', input);

      expect(inputSpy).toHaveBeenCalledWith('');
    });
  });

  describe('Input attributes', () => {
    it('should have correct id', () => {
      const input = spectator.query(byTestId('search-input'));
      expect(input?.getAttribute('id')).toBe('product-search');
    });

    it('should have correct type', () => {
      const input = spectator.query(byTestId('search-input'));
      expect(input?.getAttribute('type')).toBe('text');
    });

    it('should have form-input class', () => {
      const input = spectator.query(byTestId('search-input'));
      expect(input?.classList.contains('form-input')).toBe(true);
    });
  });
});
