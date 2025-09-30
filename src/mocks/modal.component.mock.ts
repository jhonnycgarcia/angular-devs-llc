import { Component } from '@angular/core';
import { ModalComponent } from '@shared/ui/modal/modal.component';

@Component({
  template: `
    <ui-modal
      [isOpen]="isOpen"
      [title]="title"
      [size]="size"
      [showCloseButton]="showCloseButton"
      [showFooter]="showFooter"
      [closeOnBackdrop]="closeOnBackdrop"
      (modalClose)="onModalClose()">
      <p>Modal content</p>
      <div slot="footer">Footer content</div>
    </ui-modal>
  `,
  imports: [ModalComponent]
})
export class ModalComponentMock {
  isOpen = false;
  title?: string;
  size: 'small' | 'medium' | 'large' = 'medium';
  showCloseButton = true;
  showFooter = true;
  closeOnBackdrop = true;

  onModalClose() {
    // Mock handler
  }
}
