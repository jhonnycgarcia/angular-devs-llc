import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-pagination-size',
  imports: [],
  template: `
    <label for="page-size-select" class="sr-only" data-testid="pagination-size-label">{{ ariaLabel() }}</label>
    <select
      id="page-size-select"
      [attr.aria-label]="ariaLabel()"
      value="{{selectedSize()}}"
      #pageSizeSelector
      (change)="onSelectSize(pageSizeSelector.value)"
      class="form-input"
      data-testid="pagination-size-select"
    >
      @for(size of pageSizes(); track size) {
        <option [value]="size" [selected]="size === selectedSize()">
          {{ size }} items per page
        </option>
      }
    </select>
  `,
  styles: `
    :host {
      display: block;
    }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationSizeComponent {

  public pageSizes = input<number[]>([5, 10, 20]);
  public selectedSize = input<number>(10);
  public ariaLabel = input<string>('Select number of items per page');

  public onSizeChange = output<number>();

  onSelectSize(size: string): void {
    this.onSizeChange.emit(Number(size));
  }
}
