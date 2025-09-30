import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent } from '../button/button.component';
import { PaginationSizeComponent } from '../pagination-size/pagination-size.component';

@Component({
  selector: 'ui-pagination',
  imports: [
    ButtonComponent,
    PaginationSizeComponent,
  ],
  template: `
    <div class="pagination-container" data-testid="pagination-container">
      <div class="pagination-info" data-testid="pagination-info">
        <small>{{ totalItems() }} Resultados</small>
      </div>
      @if (totalPages() > 1) {
        <div class="pagination-controls" data-testid="pagination-controls">
          <button
            ui-button
            variant="secondary"
            size="small"
            [disabled]="currentPage() === 1"
            [attr.aria-label]="'Ir a la página anterior. Página actual ' + currentPage()"
            (click)="prevPage()"
            data-testid="pagination-prev-button"
          >
            Anterior
          </button>

          <span
            class="page-info"
            [attr.aria-label]="'Página ' + currentPage() + ' de ' + totalPages()"
            data-testid="pagination-page-info"
          >
            {{ currentPage() }} de {{ totalPages() }}
          </span>

          <button
            ui-button
            variant="secondary"
            size="small"
            [disabled]="currentPage() === totalPages()"
            [attr.aria-label]="'Ir a la página siguiente. Página actual ' + currentPage()"
            (click)="nextPage()"
            data-testid="pagination-next-button"
          >
            Siguiente
          </button>
        </div>
      }
      <ui-pagination-size
        [pageSizes]="pageSizes()"
        [selectedSize]="pageSize()"
        (onSizeChange)="onPageSizeChange($event)"
        data-testid="pagination-size"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .page-info {
      font-size: 0.875rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .pagination-container {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {

  public currentPage = input.required<number>();
  public totalPages = input.required<number>();
  public pageSize = input.required<number>();
  public pageSizes = input<number[]>([5, 10, 20]);
  public totalItems = input<number>(0);

  public pageChange = output<number>();
  public pageSizeChange = output<number>();

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }
}
