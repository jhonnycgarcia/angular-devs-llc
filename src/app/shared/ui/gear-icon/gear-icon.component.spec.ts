import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { GearIconComponent } from './gear-icon.component';

describe('GearIconComponent', () => {
  let spectator: Spectator<GearIconComponent>;

  const createComponent = createComponentFactory({
    component: GearIconComponent,
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

    it('should contain gear icon paths', () => {
      const svgElement = spectator.query('svg') as SVGElement;
      const paths = svgElement.querySelectorAll('path');
      expect(paths.length).toBe(2);
      expect(paths[0].getAttribute('stroke-linecap')).toBe('round');
      expect(paths[0].getAttribute('stroke-linejoin')).toBe('round');
      expect(paths[1].getAttribute('stroke-linecap')).toBe('round');
      expect(paths[1].getAttribute('stroke-linejoin')).toBe('round');
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
