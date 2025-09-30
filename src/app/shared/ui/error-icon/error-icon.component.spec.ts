import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { ErrorIconComponent } from './error-icon.component';

describe('ErrorIconComponent', () => {
  let spectator: Spectator<ErrorIconComponent>;

  const createComponent = createComponentFactory({
    component: ErrorIconComponent,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('Inicialización', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should render with default size', () => {
      expect(spectator.component.size).toBe(24);
    });

    it('should render SVG with correct attributes', () => {
      const svgElement = spectator.query('svg') as SVGElement;
      expect(svgElement.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
      expect(svgElement.getAttribute('fill')).toBe('none');
      expect(svgElement.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svgElement.getAttribute('stroke-width')).toBe('1.5');
      expect(svgElement.getAttribute('stroke')).toBe('currentColor');
    });

    it('should contain error icon path', () => {
      const svgElement = spectator.query('svg') as SVGElement;
      const paths = svgElement.querySelectorAll('path');
      expect(paths.length).toBe(1);
      expect(paths[0].getAttribute('stroke-linecap')).toBe('round');
      expect(paths[0].getAttribute('stroke-linejoin')).toBe('round');
      expect(paths[0].getAttribute('d')).toBe('M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z');
    });
  });

  describe('Size input', () => {
    it('should update size when input changes', () => {
      spectator.setInput('size', 32);

      expect(spectator.component.size).toBe(32);
    });

    it('should handle different sizes', () => {
      const sizes = [16, 20, 24, 32, 48];

      sizes.forEach(size => {
        spectator.setInput('size', size);

        expect(spectator.component.size).toBe(size);
      });
    });
  });

  describe('ChangeDetection OnPush', () => {
    it('should work correctly with OnPush change detection strategy', () => {
      expect(spectator.component.size).toBe(24);

      spectator.setInput('size', 40);
      // No detectChanges() call here

      // Component property should be updated immediately
      expect(spectator.component.size).toBe(40);

      // Template should update after change detection
      spectator.detectChanges();
      expect(spectator.component.size).toBe(40);
    });
  });
});
