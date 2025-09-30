import { Spectator, createComponentFactory, byTestId } from '@ngneat/spectator';
import { LogoComponent } from './logo.component';
import { faker } from '@faker-js/faker';

describe('LogoComponent', () => {
  let spectator: Spectator<LogoComponent>;
  const fakeUrls = [
    faker.image.url(),
    faker.image.url(),
    faker.image.dataUri(),
    faker.image.dataUri(),
    'assets/images/logo.png',
  ];
  const defaultBaseUrl = fakeUrls[0];

  const createComponent = createComponentFactory({
    component: LogoComponent,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        src: defaultBaseUrl,
      },
    });
  });

  describe('Inicialización', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should render with provided src', () => {
      expect(spectator.component.src).toBe(defaultBaseUrl);
      const imgElement = spectator.query(byTestId('logo-image')) as HTMLImageElement;
      expect(imgElement.getAttribute('src')).toBe(defaultBaseUrl);
    });

    it('should render img with correct attributes', () => {
      const imgElement = spectator.query(byTestId('logo-image')) as HTMLImageElement;
      expect(imgElement.getAttribute('alt')).toBe('Avatar');
      expect(imgElement.hasAttribute('fill')).toBe(true);
    });
  });

  describe('Src input', () => {
    it('should update src when input changes', () => {
      const testSrc = fakeUrls[1];
      spectator.setInput('src', testSrc);

      expect(spectator.component.src).toBe(testSrc);
    });

    it('should handle different src values', () => {
      const sources = fakeUrls;

      sources.forEach(src => {
        spectator.setInput('src', src);

        expect(spectator.component.src).toBe(src);
      });
    });
  });


  describe('ChangeDetection OnPush', () => {
    it('should work correctly with OnPush change detection strategy', () => {
      const newSrc = fakeUrls[4];
      spectator.setInput('src', newSrc);

      expect(spectator.component.src).toBe(newSrc);

      spectator.detectChanges();
      expect(spectator.component.src).toBe(newSrc);
    });
  });
});
