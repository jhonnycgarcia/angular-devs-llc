import { Spectator, createComponentFactory, byTestId } from '@ngneat/spectator';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let spectator: Spectator<SkeletonComponent>;
  const createComponent = createComponentFactory({
    component: SkeletonComponent,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('Default values', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have default width', () => {
      expect(spectator.component.width).toBe('100%');
    });

    it('should have default height', () => {
      expect(spectator.component.height).toBe('1em');
    });

    it('should have default size', () => {
      expect(spectator.component.size).toBe('medium');
    });
  });

  describe('Template rendering', () => {
    it('should render span with placeholder class', () => {
      const span = spectator.query(byTestId('skeleton-placeholder'));
      expect(span).toBeTruthy();
    });

    it('should apply width style', () => {
      spectator.setInput('width', '50%');
      spectator.detectChanges();
      const span = spectator.query(byTestId('skeleton-placeholder')) as HTMLElement;
      expect(span?.style.width).toBe('50%');
    });

    it('should apply height style based on size', () => {
      spectator.setInput('size', 'small');
      spectator.detectChanges();
      const span = spectator.query(byTestId('skeleton-placeholder')) as HTMLElement;
      expect(span?.style.height).toBe('0.5em');
    });
  });

  describe('Size input', () => {
    it('should return correct height for small size', () => {
      spectator.setInput('size', 'small');
      expect(spectator.component.getHeight()).toBe('0.5em');
    });

    it('should return correct height for medium size', () => {
      spectator.setInput('size', 'medium');
      expect(spectator.component.getHeight()).toBe('1em');
    });

    it('should return correct height for large size', () => {
      spectator.setInput('size', 'large');
      expect(spectator.component.getHeight()).toBe('1.5em');
    });

    it('should return custom height for custom size', () => {
      spectator.setInput('size', 'custom');
      spectator.setInput('height', '2em');
      expect(spectator.component.getHeight()).toBe('2em');
    });
  });

  describe('Height input', () => {
    it('should use height input when size is custom', () => {
      spectator.setInput('size', 'custom');
      spectator.setInput('height', '3em');
      spectator.detectChanges();
      const span = spectator.query(byTestId('skeleton-placeholder')) as HTMLElement;
      expect(span?.style.height).toBe('3em');
    });
  });

  describe('Width input', () => {
    it('should apply width style', () => {
      spectator.setInput('width', '200px');
      spectator.detectChanges();
      const span = spectator.query('span.placeholder') as HTMLElement;
      expect(span?.style.width).toBe('200px');
    });
  });
});
