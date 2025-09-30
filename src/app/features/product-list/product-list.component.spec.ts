import { Spectator, createComponentFactory, byTestId } from '@ngneat/spectator';
import { of, throwError } from 'rxjs';
import { faker } from '@faker-js/faker';
import { ActivatedRoute } from '@angular/router';

import { ProductListComponent } from './product-list.component';
import { ProductApiService } from '@shared/data/product-api.service';
import { Router } from '@angular/router';
import { Product } from '@shared/models';
import { signal } from '@angular/core';

// Mock data
const mockProducts: Product[] = [
  {
    id: faker.string.alphanumeric(8),
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    logo: faker.internet.url(),
    date_release: faker.date.future().toISOString().split('T')[0],
    date_revision: faker.date.future().toISOString().split('T')[0],
  },
  {
    id: faker.string.alphanumeric(8),
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    logo: faker.internet.url(),
    date_release: faker.date.future().toISOString().split('T')[0],
    date_revision: faker.date.future().toISOString().split('T')[0],
  },
];

// Mocks
const mockRouter = {
  navigate: jest.fn(),
};

const mockActivatedRoute = {
  snapshot: {},
};

const mockProductApiService = {
  products: {
    data: jest.fn(),
    isFetching: jest.fn(),
    isError: jest.fn(),
    error: jest.fn(),
  },
  selectedProduct: Object.assign(jest.fn(), { set: jest.fn() }),
  removeProduct: {
    mutateAsync: jest.fn(),
  },
};

describe('ProductListComponent', () => {
  let spectator: Spectator<ProductListComponent>;
  let consoleErrorSpy: jest.SpyInstance;

  const createComponent = createComponentFactory({
    component: ProductListComponent,
    providers: [
      { provide: Router, useValue: mockRouter },
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      { provide: ProductApiService, useValue: mockProductApiService },
    ],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
    mockProductApiService.products.data.mockReturnValue(mockProducts);
    mockProductApiService.products.isFetching.mockReturnValue(false);
    mockProductApiService.products.isError.mockReturnValue(false);
    mockProductApiService.products.error.mockReturnValue(null);
    mockProductApiService.selectedProduct.mockReturnValue(null);
    mockProductApiService.removeProduct.mutateAsync.mockResolvedValue('Deleted');
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Creación y renderizado inicial', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should render search input and add button', () => {
      expect(spectator.query(byTestId('product-list-search'))).toBeTruthy();
      expect(spectator.query(byTestId('product-list-add-button'))).toBeTruthy();
    });

    it('should render table with products', () => {
      expect(spectator.query(byTestId('product-list-table'))).toBeTruthy();
      expect(spectator.queryAll(byTestId(/^product-row-/))).toHaveLength(2);
    });

    it('should render pagination', () => {
      expect(spectator.query(byTestId('product-list-pagination'))).toBeTruthy();
    });
  });

  describe('Filtrado', () => {
    it('should filter products by name', () => {
      spectator.component.queryString.set(mockProducts[0].name);
      spectator.detectChanges();

      expect(spectator.queryAll(byTestId(/^product-row-/))).toHaveLength(1);
    });

    it('should show no results message when no matches', () => {
      spectator.component.queryString.set('nonexistent');
      spectator.detectChanges();

      expect(spectator.query(byTestId('product-no-results'))).toBeTruthy();
    });
  });

  describe('Paginación', () => {
    it('should change page size', () => {
      spectator.component.onPageSizeChange(5);
      expect(spectator.component.pageSize()).toBe(5);
      expect(spectator.component.currentPage()).toBe(1);
    });

    it('should go to next page', () => {
      spectator.component.pageSize.set(1); // Force pagination
      spectator.component.nextPage();
      expect(spectator.component.currentPage()).toBe(2);
    });
  });

  describe('Acciones', () => {
    it('should navigate to edit on Edit action', () => {
      const product = mockProducts[0];
      spectator.component.onAction('Edit', product);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit']);
      expect(mockProductApiService.selectedProduct.set).toHaveBeenCalledWith(product);
    });

    it('should open delete modal on Delete action', () => {
      const product = mockProducts[0];
      spectator.component.onAction('Delete', product);

      expect(spectator.component.showDeleteModal()).toBeTruthy();
      expect(mockProductApiService.selectedProduct.set).toHaveBeenCalledWith(product);
    });
  });

  describe('Modal de eliminación', () => {
    beforeEach(() => {
      mockProductApiService.selectedProduct.mockReturnValue(mockProducts[0]);
      spectator.component.onAction('Delete', mockProducts[0]);
      spectator.detectChanges();
    });

    it('should render delete modal', () => {
      expect(spectator.query(byTestId('product-delete-modal'))).toBeTruthy();
    });

    it('should execute delete successfully', async () => {
      await spectator.component.executeDelete();

      expect(mockProductApiService.removeProduct.mutateAsync).toHaveBeenCalledWith(mockProducts[0].id);
      expect(spectator.component.showDeleteModal()).toBeFalsy();
      expect(mockProductApiService.selectedProduct.set).toHaveBeenCalledWith(null);
    });

    it('should cancel delete', () => {
      spectator.component.cancelDelete();

      expect(spectator.component.showDeleteModal()).toBeFalsy();
      expect(mockProductApiService.selectedProduct.set).toHaveBeenCalledWith(null);
    });
  });

});
