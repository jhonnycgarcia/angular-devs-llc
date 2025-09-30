import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { ModalComponent } from './modal.component';
import { ModalComponentMock } from '../../../../mocks/modal.component.mock';

describe('ModalComponent', () => {
  let spectator: Spectator<ModalComponentMock>;

  const createComponent = createComponentFactory({
    component: ModalComponentMock,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('Default values', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have default size', () => {
      expect(spectator.component.size).toBe('medium');
    });

    it('should have default showCloseButton', () => {
      expect(spectator.component.showCloseButton).toBe(true);
    });

    it('should have default showFooter', () => {
      expect(spectator.component.showFooter).toBe(true);
    });

    it('should have default closeOnBackdrop', () => {
      expect(spectator.component.closeOnBackdrop).toBe(true);
    });
  });

  describe('Modal visibility', () => {
    it('should not render modal when isOpen is false', () => {
      spectator.component.isOpen = false;
      spectator.detectChanges();
      expect(spectator.query('.modal-backdrop')).toBeFalsy();
    });

    it('should render modal when isOpen is true', () => {
      spectator.component.isOpen = true;
      spectator.detectChanges();
      expect(spectator.query('.modal-backdrop')).toBeTruthy();
    });
  });

  describe('Modal structure', () => {
    beforeEach(() => {
      spectator.component.isOpen = true;
      spectator.detectChanges();
    });

    it('should render modal dialog with proper attributes', () => {
      const dialog = spectator.query('.modal-dialog');
      expect(dialog).toBeTruthy();
      expect(dialog?.getAttribute('role')).toBe('dialog');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
      expect(dialog?.getAttribute('tabindex')).toBe('-1');
    });

    it('should render modal content', () => {
      const content = spectator.query('.modal-content');
      expect(content).toBeTruthy();
      expect(content?.textContent?.trim()).toBe('Modal content');
    });
  });

  describe('Title handling', () => {
    beforeEach(() => {
      spectator.component.isOpen = true;
      spectator.detectChanges();
    });

    it('should not render header when title is not provided', () => {
      expect(spectator.query('.modal-header')).toBeFalsy();
    });

    it('should render header and title when title is provided', () => {
      spectator.component.title = 'Test Modal';
      spectator.detectChanges();

      const header = spectator.query('.modal-header');
      const title = spectator.query('.modal-title');

      expect(header).toBeTruthy();
      expect(title).toBeTruthy();
      expect(title?.textContent?.trim()).toBe('Test Modal');
    });
  });

  describe('Footer handling', () => {
    beforeEach(() => {
      spectator.component.isOpen = true;
      spectator.detectChanges();
    });

    it('should render footer by default', () => {
      expect(spectator.query('.modal-footer')).toBeTruthy();
      expect(spectator.query('.modal-footer')?.textContent?.trim()).toBe('Footer content');
    });

    it('should not render footer when showFooter is false', () => {
      spectator.component.showFooter = false;
      spectator.detectChanges();
      expect(spectator.query('.modal-footer')).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      spectator.component.isOpen = true;
      spectator.detectChanges();
    });

    it('should have proper ARIA attributes', () => {
      const dialog = spectator.query('.modal-dialog');
      expect(dialog?.getAttribute('role')).toBe('dialog');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
      expect(dialog?.getAttribute('aria-describedby')).toBe('modal-content');
    });
  });
});
