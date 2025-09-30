import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';

import { LogoComponent, CardComponent, DropdownComponent, GearIconComponent, PaginationComponent, SkeletonComponent } from '@shared/ui';
import { Product } from '@shared/models';
import { ProductApiService } from '@shared/data/product-api.service';
import { AddProductButtonComponent } from './ui/add-product-button/add-product-button.component';
import { ModalProductDeleteComponent } from './ui/modal-product-delete/modal-product-delete.component';
import { SearchInputComponent } from '@shared/ui/search-input/search-input.component';

@Component({
  selector: 'product-list',
  imports: [
    CardComponent,
    DatePipe,
    DropdownComponent,
    GearIconComponent,
    LogoComponent,
    NgTemplateOutlet,
    SkeletonComponent,
    PaginationComponent,
    AddProductButtonComponent,
    ModalProductDeleteComponent,
    SearchInputComponent,
  ],
  templateUrl: './product-list.component.html',
  styles: `
    :host {
      display: block;
    }

    .action-section {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .product-table {
      width: 100%;
      border-collapse: collapse;
    }

    .product-table th,
    .product-table td {
      border-bottom: 1px solid #ddd;
      padding: 0.75rem;
      text-align: left;
    }

    .product-table tbody tr:last-child th,
    .product-table tbody tr:last-child td {
      border-bottom: none;
    }

    .table-container {
      overflow-x: auto;
    }

    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .product-table th,
      .product-table td {
        padding: 0.5rem;
        font-size: 0.875rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {

  public readonly productApi = inject(ProductApiService);
  private readonly router = inject(Router);

  public readonly actions = [
    'Editar',
    'Eliminar'
  ];
  public queryString = signal('');
  public pageSize = signal(10);
  public currentPage = signal(1);

  public products = computed(() => this.productApi.products.data() || []);

  public filteredProducts = computed(() => {
    const products = this.products();
    const query = this.queryString().toLowerCase().trim();

    if(!query) return products;

    return products.filter((product) => {
      return product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
    });
  });

  public totalRecords = computed(() => this.filteredProducts().length);

  public paginatedProducts = computed(() => {
    const products = this.filteredProducts();
    const start = (this.currentPage() - 1) * this.pageSize();
    return products.slice(start, start + this.pageSize());
  });

  public totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.pageSize()));

  public isLoading = computed(() => this.productApi.products.isFetching());
  public hasError = computed(() => this.productApi.products.isError());
  public error = computed(() => this.productApi.products.error());

  public showDeleteModal = signal(false);
  public isDeleting = signal(false);

  public onAction(action: string, product: Product) {
    switch (action) {
      case 'Edit':
        this.productApi.selectedProduct.set(product);
        this.router.navigate(['/edit']);
        break;
      case 'Delete':
        this.confirmDelete(product);
        break;
      default:
        break;
    }
  }

  private confirmDelete(product: Product): void {
    this.productApi.selectedProduct.set(product);
    this.showDeleteModal.set(true);
  }

  async executeDelete(): Promise<void> {
    const product = this.productApi.selectedProduct();
    if(!product || this.isDeleting()) return;

    this.isDeleting.set(true);
    try {
      const message = await this.productApi.removeProduct.mutateAsync(product.id);
      this.productApi.selectedProduct.set(null);
      this.showDeleteModal.set(false);

    } catch (error) {
      throw error;
    } finally {
      this.isDeleting.set(false);
    }
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.productApi.selectedProduct.set(null);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

}
