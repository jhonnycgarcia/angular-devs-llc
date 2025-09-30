import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ModalComponent } from '@shared/ui';

@Component({
  selector: 'modal-product-delete',
  imports: [
    ModalComponent,
  ],
  template: `
    <ui-modal
      [isOpen]="showDeleteModal()"
      title="Confirmar Eliminación"
      size="small"
      (modalClose)="cancelDelete.emit()"
      data-testid="modal-product-delete"
    >
      @if(productName()){
        <p data-testid="delete-message">
          ¿Estás seguro de que quieres eliminar <strong>{{ productName() }}</strong
          >?
        </p>
      }

      <p class="warning-text" data-testid="delete-help-message">Esta acción no se puede deshacer.</p>

      <div slot="footer">
        <button
          ui-button
          variant="secondary"
          (buttonClick)="cancelDelete.emit()"
          [disabled]="isDeleting()"
          data-testid="cancel-delete-button"
        >Cancelar</button>
        <button
          ui-button
          variant="danger"
          (buttonClick)="executeDelete.emit()"
          [disabled]="isDeleting()"
          data-testid="confirm-delete-button"
        >
          @if (isDeleting()) {
            Eliminando...
          } @else {
            Eliminar
          }
        </button>
      </div>
    </ui-modal>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalProductDeleteComponent {
  public showDeleteModal = input<boolean>(false);
  public isDeleting = input<boolean>(false);
  public productName = input<string | null>(null);

  public executeDelete = output<void>();
  public cancelDelete = output<void>();
}
