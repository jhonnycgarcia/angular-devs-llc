import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { SuccessIconComponent } from './success-icon.component';

describe('SuccessIconComponent', () => {
  let spectator: Spectator<SuccessIconComponent>;

  const createComponent = createComponentFactory({
    component: SuccessIconComponent,
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

    it('should contain success icon path', () => {
      const svgElement = spectator.query('svg') as SVGElement;
      const paths = svgElement.querySelectorAll('path');
      expect(paths.length).toBe(1);
      expect(paths[0].getAttribute('stroke-linecap')).toBe('round');
      expect(paths[0].getAttribute('stroke-linejoin')).toBe('round');
      expect(paths[0].getAttribute('d')).toBe('M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
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
