import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'search-input',
  imports: [],
  template: `
    <div>
      <label for="product-search" class="sr-only">
        {{ label() }}
      </label>
      <input
        #searchInput
        type="text"
        id="product-search"
        [value]="value()"
        [attr.aria-label]="ariaLabel()"
        [placeholder]="placeholder()"
        class="form-input"
        (input)="onInputChange.emit(searchInput.value)"
        data-testid="search-input"
      >
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  public value = input<string>('');
  public label = input<string>('Etiqueta de búsqueda');
  public placeholder = input<string>('Marcador de posición de búsqueda');
  public ariaLabel = input<string>('Entrada de búsqueda');

  public onInputChange = output<string>();
}
