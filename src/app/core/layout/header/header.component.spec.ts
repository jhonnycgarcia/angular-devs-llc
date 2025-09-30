import { Spectator, createComponentFactory, byTestId } from '@ngneat/spectator';
import { HeaderComponent } from './header.component';
import { HeaderComponentMock } from '@mocks/header.component.mock';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponentMock>;

  const createComponent = createComponentFactory({
    component: HeaderComponentMock,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('Inicialización', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should render with default title', () => {
      const headerComponent = spectator.query(HeaderComponent);
      expect(headerComponent?.title()).toBe('Test Title');
    });

    it('should display the title in h1 element', () => {
      const h1Element = spectator.query(byTestId('header-title'));
      expect(h1Element).toBeTruthy();
      expect(h1Element?.textContent?.trim()).toBe('Test Title');
    });

    it('should render money-icon component', () => {
      const moneyIcon = spectator.query(byTestId('header-money-icon'));
      expect(moneyIcon).toBeTruthy();
    });
  });

  describe('Host bindings - Atributos', () => {
    it('should set role attribute to banner', () => {
      const headerElement = spectator.query('ui-header');
      expect(headerElement?.getAttribute('role')).toBe('banner');
    });
  });

  describe('Money icon attributes', () => {
    it('should set aria-hidden to true on money-icon', () => {
      const moneyIcon = spectator.query(byTestId('header-money-icon'));
      expect(moneyIcon?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Input changes', () => {
    it('should update title when input changes', () => {
      spectator.component.title = 'New Title';
      spectator.detectChanges();

      const headerComponent = spectator.query(HeaderComponent);
      expect(headerComponent?.title()).toBe('New Title');

      const h1Element = spectator.query(byTestId('header-title'));
      expect(h1Element?.textContent?.trim()).toBe('New Title');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string title', () => {
      spectator.component.title = '';
      spectator.detectChanges();

      const h1Element = spectator.query(byTestId('header-title'));
      expect(h1Element?.textContent?.trim()).toBe('');
    });

    it('should handle long title', () => {
      const longTitle = 'This is a very long title for testing purposes';
      spectator.component.title = longTitle;
      spectator.detectChanges();

      const h1Element = spectator.query(byTestId('header-title'));
      expect(h1Element?.textContent?.trim()).toBe(longTitle);
    });
  });

  describe('ChangeDetection OnPush', () => {
    it('should work correctly with OnPush change detection strategy', () => {
      const h1Element = spectator.query(byTestId('header-title'));
      expect(h1Element?.textContent?.trim()).toBe('Test Title');

      spectator.component.title = 'OnPush Test Title';

      expect(h1Element?.textContent?.trim()).toBe('Test Title');

      spectator.detectChanges();
      expect(h1Element?.textContent?.trim()).toBe('OnPush Test Title');
    });
  });
});
