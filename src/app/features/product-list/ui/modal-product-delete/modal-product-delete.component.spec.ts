import { Spectator, createComponentFactory, byTestId } from '@ngneat/spectator/jest';
import { By } from '@angular/platform-browser';

import { ModalProductDeleteComponent } from './modal-product-delete.component';

describe('ModalProductDeleteComponent', () => {
  const createComponent = createComponentFactory({
    component: ModalProductDeleteComponent,
  });

  describe('Inicialización', () => {
    it('should create', () => {
      const spectator = createComponent({ props: {} });
      expect(spectator.component).toBeTruthy();
    });

    it('should have default inputs', () => {
      const spectator = createComponent({ props: {} });
      expect(spectator.component.showDeleteModal()).toBe(false);
      expect(spectator.component.isDeleting()).toBe(false);
      expect(spectator.component.productName()).toBe(null);
    });
  });

  describe('Modal display', () => {
    it('should show modal when showDeleteModal is true', () => {
      const spectator = createComponent({ props: { showDeleteModal: true } });
      const modal = spectator.query(byTestId('modal-product-delete'));
      expect(modal).toBeTruthy();
    });
  });

  describe('Product name display', () => {
    it('should not show product name when productName is null', () => {
      const spectator = createComponent({ props: { showDeleteModal: true, productName: null } });
      const productText = spectator.query(byTestId('delete-message'));
      expect(productText).toBeFalsy();
    });

    it('should show product name when productName is provided', () => {
      const spectator = createComponent({ props: { showDeleteModal: true, productName: 'Producto de Prueba' } });
      const productText = spectator.query(byTestId('delete-message'));
      expect(productText?.textContent?.trim()).toBe('¿Estás seguro de que quieres eliminar Producto de Prueba?');
    });
  });

  describe('Warning text', () => {
    it('should display warning text', () => {
      const spectator = createComponent({ props: { showDeleteModal: true } });
      const warningText = spectator.query(byTestId('delete-help-message'));
      expect(warningText?.textContent?.trim()).toBe('Esta acción no se puede deshacer.');
    });
  });

  describe('Button interactions', () => {
    it('should emit cancelDelete when modal close is triggered', () => {
      const spectator = createComponent({ props: { showDeleteModal: true } });
      const cancelSpy = jest.spyOn(spectator.component.cancelDelete, 'emit');

      const modalDebug = spectator.debugElement.query(By.css('[data-testid="modal-product-delete"]'));
      modalDebug.triggerEventHandler('modalClose', {});

      expect(cancelSpy).toHaveBeenCalled();
    });
  });

  describe('Button states during deletion', () => {
    it('should enable buttons when not deleting', () => {
      const spectator = createComponent({ props: { showDeleteModal: true, isDeleting: false } });
      const cancelButton = spectator.query(byTestId('cancel-delete-button')) as HTMLButtonElement;
      const deleteButton = spectator.query(byTestId('confirm-delete-button')) as HTMLButtonElement;

      expect(cancelButton.disabled).toBe(false);
      expect(deleteButton.disabled).toBe(false);
    });

    it('should disable buttons when deleting', () => {
      const spectator = createComponent({ props: { showDeleteModal: true, isDeleting: true } });
      const cancelButton = spectator.query(byTestId('cancel-delete-button')) as HTMLButtonElement;
      const deleteButton = spectator.query(byTestId('confirm-delete-button')) as HTMLButtonElement;

      expect(cancelButton.disabled).toBe(true);
      expect(deleteButton.disabled).toBe(true);
    });

    it('should show "Eliminar" text when not deleting', () => {
      const spectator = createComponent({ props: { showDeleteModal: true, isDeleting: false } });
      const deleteButton = spectator.query(byTestId('confirm-delete-button'));
      expect(deleteButton?.textContent?.trim()).toBe('Eliminar');
    });

    it('should show "Eliminando..." text when deleting', () => {
      const spectator = createComponent({ props: { showDeleteModal: true, isDeleting: true } });
      const deleteButton = spectator.query(byTestId('confirm-delete-button'));
      expect(deleteButton?.textContent?.trim()).toBe('Eliminando...');
    });
  });
});
