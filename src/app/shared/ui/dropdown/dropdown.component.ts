import { ChangeDetectionStrategy, Component, ElementRef, HostListener, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { EllipsisIconComponent } from '../ellipsis-icon/ellipsis-icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-dropdown',
  imports: [
    ButtonComponent,
    EllipsisIconComponent,
    NgClass,
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  public options = input<string[]>([]);
  public emptyOptions = input<string>('No hay opciones disponibles');
  public ariaLabel = input<string>('Menú de opciones');
  public isOpen = signal<boolean>(false);
  public position = signal<'below' | 'above'>('below');

  public select = output<string>();

  constructor(private elementRef: ElementRef) {}

  toggle() {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedHeight = 200; // rough estimate

    if (spaceBelow >= estimatedHeight) {
      this.position.set('below');
    } else if (spaceAbove >= estimatedHeight) {
      this.position.set('above');
    } else {
      this.position.set('below'); // fallback
    }

    this.isOpen.set(!this.isOpen());
  }

  onSelect(option: string) {
    this.select.emit(option);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    this.isOpen.set(false);
    event.preventDefault();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }
}
