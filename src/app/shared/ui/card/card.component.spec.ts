import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { CardComponent } from './card.component';
import { CardComponentMock } from '../../../../mocks/card.component.mock';

describe('CardComponent', () => {
  let spectator: Spectator<CardComponentMock>;

  const createComponent = createComponentFactory({
    component: CardComponentMock,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('Inicialización', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should render with default values', () => {
      const cardComponent = spectator.query(CardComponent);
      expect(cardComponent?.ariaLabel()).toBeUndefined();
      expect(cardComponent?.ariaLabelledBy()).toBeUndefined();
    });

    it('should display projected content', () => {
      const projectedContent = spectator.query('p');
      expect(projectedContent).toBeTruthy();
      expect(projectedContent?.textContent?.trim()).toBe('Test content');
    });
  });

  describe('Host bindings - Atributos', () => {
    it('should set role attribute to region', () => {
      const cardElement = spectator.query('card');
      expect(cardElement?.getAttribute('role')).toBe('region');
    });

    it('should set aria-label attribute when provided', () => {
      const cardElement = spectator.query('card');
      expect(cardElement?.getAttribute('aria-label')).toBeNull();

      spectator.component.ariaLabel = 'Test card label';
      spectator.detectChanges();
      expect(cardElement?.getAttribute('aria-label')).toBe('Test card label');
    });

    it('should set aria-labelledby attribute when provided', () => {
      const cardElement = spectator.query('card');
      expect(cardElement?.getAttribute('aria-labelledby')).toBeNull();

      spectator.component.ariaLabelledBy = 'header-id';
      spectator.detectChanges();
      expect(cardElement?.getAttribute('aria-labelledby')).toBe('header-id');
    });
  });

  describe('Input changes', () => {
    it('should update when inputs change', () => {
      spectator.component.ariaLabel = 'New label';
      spectator.component.ariaLabelledBy = 'new-header-id';
      spectator.detectChanges();

      const cardComponent = spectator.query(CardComponent);
      expect(cardComponent?.ariaLabel()).toBe('New label');
      expect(cardComponent?.ariaLabelledBy()).toBe('new-header-id');

      const cardElement = spectator.query('card');
      expect(cardElement?.getAttribute('aria-label')).toBe('New label');
      expect(cardElement?.getAttribute('aria-labelledby')).toBe('new-header-id');
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined ariaLabel', () => {
      spectator.component.ariaLabel = undefined;
      spectator.detectChanges();
      const cardElement = spectator.query('card');
      expect(cardElement?.getAttribute('aria-label')).toBeNull();
    });

    it('should handle empty string ariaLabel', () => {
      spectator.component.ariaLabel = '';
      spectator.detectChanges();
      const cardElement = spectator.query('card');
      expect(cardElement?.getAttribute('aria-label')).toBe('');
    });

    it('should handle undefined ariaLabelledBy', () => {
      spectator.component.ariaLabelledBy = undefined;
      spectator.detectChanges();
      const cardElement = spectator.query('card');
      expect(cardElement?.getAttribute('aria-labelledby')).toBeNull();
    });

    it('should handle empty string ariaLabelledBy', () => {
      spectator.component.ariaLabelledBy = '';
      spectator.detectChanges();
      const cardElement = spectator.query('card');
      expect(cardElement?.getAttribute('aria-labelledby')).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      const cardElement = spectator.query('card');
      expect(cardElement?.getAttribute('role')).toBe('region');
      expect(cardElement?.hasAttribute('aria-label')).toBe(false);
      expect(cardElement?.hasAttribute('aria-labelledby')).toBe(false);
    });
  });

  describe('ChangeDetection OnPush', () => {
    it('should work correctly with OnPush change detection strategy', () => {
      const cardElement = spectator.query('card');
      expect(cardElement?.querySelector('p')).toBeTruthy();

      spectator.component.ariaLabel = 'OnPush test';

      expect(cardElement?.getAttribute('aria-label')).toBeNull();

      spectator.detectChanges();
      expect(cardElement?.getAttribute('aria-label')).toBe('OnPush test');
    });
  });
});
