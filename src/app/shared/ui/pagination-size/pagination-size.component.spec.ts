import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { PaginationSizeComponent } from './pagination-size.component';

describe('PaginationSizeComponent', () => {
  let spectator: Spectator<PaginationSizeComponent>;

  const createComponent = createComponentFactory({
    component: PaginationSizeComponent,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('Default values', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have default pageSizes', () => {
      expect(spectator.component.pageSizes()).toEqual([5, 10, 20]);
    });

    it('should have default selectedSize', () => {
      expect(spectator.component.selectedSize()).toBe(10);
    });

    it('should have default ariaLabel', () => {
      expect(spectator.component.ariaLabel()).toBe('Select number of items per page');
    });
  });

  describe('Template rendering', () => {
    it('should render select element', () => {
      const select = spectator.query('select');
      expect(select).toBeTruthy();
    });

    it('should render label with aria-label', () => {
      const label = spectator.query('label');
      expect(label).toBeTruthy();
      expect(label?.getAttribute('for')).toBe('page-size-select');
      expect(label?.classList.contains('sr-only')).toBe(true);
    });

    it('should render options for each page size', () => {
      const options = spectator.queryAll('option');
      expect(options.length).toBe(3);

      expect(options[0]?.textContent?.trim()).toBe('5 items per page');
      expect(options[1]?.textContent?.trim()).toBe('10 items per page');
      expect(options[2]?.textContent?.trim()).toBe('20 items per page');
    });


    it('should have select element', () => {
      const select = spectator.query('select');
      expect(select).toBeTruthy();
    });
  });

  describe('Input changes', () => {
    it('should update pageSizes when input changes', () => {
      spectator.setInput('pageSizes', [10, 25, 50]);
      spectator.detectChanges();

      const options = spectator.queryAll('option');
      expect(options.length).toBe(3);
      expect(options[0]?.textContent?.trim()).toBe('10 items per page');
      expect(options[1]?.textContent?.trim()).toBe('25 items per page');
      expect(options[2]?.textContent?.trim()).toBe('50 items per page');
    });

    it('should update selectedSize when input changes', () => {
      spectator.setInput('selectedSize', 20);
      spectator.detectChanges();

      expect(spectator.component.selectedSize()).toBe(20);
    });

    it('should update ariaLabel when input changes', () => {
      spectator.setInput('ariaLabel', 'Custom label');
      spectator.detectChanges();

      const label = spectator.query('label');
      expect(label?.textContent?.trim()).toBe('Custom label');

      const select = spectator.query('select');
      expect(select?.getAttribute('aria-label')).toBe('Custom label');
    });
  });


  describe('User interactions', () => {
    it('should emit onSizeChange when select value changes', () => {
      const outputSpy = jest.spyOn(spectator.component.onSizeChange, 'emit');

      const select = spectator.query('select') as HTMLSelectElement;
      select.value = '20';
      select.dispatchEvent(new Event('change'));

      expect(outputSpy).toHaveBeenCalledWith(20);
    });

    it('should convert string value to number when emitting', () => {
      const outputSpy = jest.spyOn(spectator.component.onSizeChange, 'emit');

      const select = spectator.query('select') as HTMLSelectElement;
      select.value = '5';
      select.dispatchEvent(new Event('change'));

      expect(outputSpy).toHaveBeenCalledWith(5);
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label attribute', () => {
      const select = spectator.query('select');
      expect(select?.getAttribute('aria-label')).toBe('Select number of items per page');
    });

    it('should have proper label association', () => {
      const label = spectator.query('label');
      const select = spectator.query('select');

      expect(label?.getAttribute('for')).toBe('page-size-select');
      expect(select?.getAttribute('id')).toBe('page-size-select');
    });
  });
});
