import { SpectatorService, createServiceFactory } from "@ngneat/spectator";
import { ProductApiService } from "./product-api.service";
import { provideTanStackQuery, QueryClient } from "@tanstack/angular-query-experimental";

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Product } from '@shared/models';
import { faker } from "@faker-js/faker";
import { environment } from "@env/environment.development";

// Mock sleep to avoid delays in tests
jest.mock('src/app/utils/utils', () => ({
  sleep: jest.fn(() => Promise.resolve())
}));

describe('ProductApiService', () => {
  let spectator: SpectatorService<ProductApiService>;
  let httpMock: HttpTestingController;
  let queryClientMock: QueryClient;
  const apiURL = `${environment.apiUrl}/products`;

  const mockProduct: Product = {
    id: faker.string.alphanumeric(8),
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    logo: faker.internet.url(),
    date_release: faker.date.future().toISOString().split('T')[0],
    date_revision: faker.date.future().toISOString().split('T')[0],
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retryDelay: 1,
        retry: 0,
      },
    },
  });

  const createService = createServiceFactory({
    service: ProductApiService,
    providers: [
      provideTanStackQuery(queryClient),
      provideHttpClient(),
      provideHttpClientTesting(),
    ]
  });

  beforeEach(() => {
    spectator = createService();
    httpMock = spectator.inject(HttpTestingController);
    queryClientMock = spectator.inject(QueryClient);

    queryClient.clear();
    queryClientMock.clear();
  });

  describe('Init with default value', () => {
    it('should be created', () => {
      expect(spectator).toBeTruthy();
    });

    it('should have default values', () => {
      expect(spectator.service.selectedProduct()).toBeNull();
    });
  });

  describe('selectedProduct signal', () => {
    it('should allow setting and getting product', () => {
      spectator.service.selectedProduct.set(mockProduct);
      expect(spectator.service.selectedProduct()).toEqual(mockProduct);
    });
  });

  describe('isIdTaken method', () => {
    it('should return true when ID is taken', async () => {
      const testId = 'test-id';

      const promise = spectator.service.isIdTaken(testId);

      const req = httpMock.expectOne(`${apiURL}/verification/${testId}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);

      await expect(promise).resolves.toBe(true);
    });

    it('should return false when ID is available', async () => {
      const testId = 'available-id';

      const promise = spectator.service.isIdTaken(testId);

      const req = httpMock.expectOne(`${apiURL}/verification/${testId}`);
      expect(req.request.method).toBe('GET');
      req.flush(false);

      await expect(promise).resolves.toBe(false);
    });

    it('should handle verification error', async () => {
      const testId = 'error-id';

      const promise = spectator.service.isIdTaken(testId);

      const req = httpMock.expectOne(`${apiURL}/verification/${testId}`);
      expect(req.request.method).toBe('GET');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

      await expect(promise).rejects.toBeDefined();
    });
  });

  describe('createProduct method', () => {
    it('should create product successfully', async () => {
      const promise = spectator.service.createProduct(mockProduct);

      const req = httpMock.expectOne(apiURL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush({ data: mockProduct, message: 'Created' });

      await expect(promise).resolves.toEqual(mockProduct);
    });

    it('should handle create error', async () => {
      const promise = spectator.service.createProduct(mockProduct);

      const req = httpMock.expectOne(apiURL);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      await expect(promise).rejects.toBeDefined();
    });
  });

  describe('getProducts method', () => {
    it('should return products successfully', async () => {
      const mockProducts = [mockProduct];

      const promise = spectator.service.getProducts();

      const req = httpMock.expectOne(apiURL);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockProducts });

      await expect(promise).resolves.toEqual(mockProducts);
    });

    it('should return empty array when no products', async () => {
      const promise = spectator.service.getProducts();

      const req = httpMock.expectOne(apiURL);
      expect(req.request.method).toBe('GET');
      req.flush({ data: [] });

      await expect(promise).resolves.toEqual([]);
    });

    it('should return empty array when data is null', async () => {
      const promise = spectator.service.getProducts();

      const req = httpMock.expectOne(apiURL);
      expect(req.request.method).toBe('GET');
      req.flush({ data: null });

      await expect(promise).resolves.toEqual([]);
    });

    it('should handle get products error', async () => {
      const promise = spectator.service.getProducts();

      const req = httpMock.expectOne(apiURL);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      await expect(promise).rejects.toBeDefined();
    });
  });

  describe('deleteProduct method', () => {
    it('should delete product successfully', async () => {
      const testId = 'test-id';

      const promise = spectator.service.deleteProduct(testId);

      const req = httpMock.expectOne(`${apiURL}/${testId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Deleted' });

      await expect(promise).resolves.toBe('Deleted');
    });

    it('should handle delete error', async () => {
      const testId = 'test-id';

      const promise = spectator.service.deleteProduct(testId);

      const req = httpMock.expectOne(`${apiURL}/${testId}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      await expect(promise).rejects.toBeDefined();
    });
  });

  describe('updateProduct method', () => {
    it('should update product successfully', async () => {
      const testId = 'test-id';

      const promise = spectator.service.updateProduct(testId, mockProduct);

      const req = httpMock.expectOne(`${apiURL}/${testId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockProduct);
      req.flush({ message: 'Updated' });

      await expect(promise).resolves.toBe('Updated');
    });

    it('should handle update error', async () => {
      const testId = 'test-id';

      const promise = spectator.service.updateProduct(testId, mockProduct);

      const req = httpMock.expectOne(`${apiURL}/${testId}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      await expect(promise).rejects.toBeDefined();
    });
  });

});


