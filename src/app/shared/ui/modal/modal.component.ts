import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-modal',
  imports: [ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.small]': 'size() === "small"',
    '[class.large]': 'size() === "large"',
  },
})
export class ModalComponent {
  isOpen = input.required<boolean>();
  title = input<string>();
  size = input<'small' | 'medium' | 'large'>('medium');
  showCloseButton = input(true);
  showFooter = input(true);
  closeOnBackdrop = input(true);

  modalClose = output<void>();

  handleBackdropClick(event: Event) {
    if (this.closeOnBackdrop() && event.target === event.currentTarget) {
      this.close();
    }
  }

  close() {
    this.modalClose.emit();
  }
}
