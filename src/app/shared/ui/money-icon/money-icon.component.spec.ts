import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MoneyIconComponent } from './money-icon.component';

describe('MoneyIconComponent', () => {
  let spectator: Spectator<MoneyIconComponent>;

  const createComponent = createComponentFactory({
    component: MoneyIconComponent,
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

    it('should contain money icon path', () => {
      const svgElement = spectator.query('svg') as SVGElement;
      const paths = svgElement.querySelectorAll('path');
      expect(paths.length).toBe(1);
      expect(paths[0].getAttribute('stroke-linecap')).toBe('round');
      expect(paths[0].getAttribute('stroke-linejoin')).toBe('round');
      expect(paths[0].getAttribute('d')).toBe('M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z');
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
