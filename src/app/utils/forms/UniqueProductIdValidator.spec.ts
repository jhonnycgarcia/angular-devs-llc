import { TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { UniqueProductIdValidator } from './UniqueProductIdValidator';
import { ProductApiService } from '@shared/data/product-api.service';

describe('UniqueProductIdValidator', () => {
  let validator: UniqueProductIdValidator;
  let mockProductApiService: jest.Mocked<ProductApiService>;

  beforeEach(() => {
    const apiSpy = {
      isIdTaken: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        UniqueProductIdValidator,
        { provide: ProductApiService, useValue: apiSpy }
      ]
    });

    validator = TestBed.inject(UniqueProductIdValidator);
    mockProductApiService = TestBed.inject(ProductApiService) as jest.Mocked<ProductApiService>;
  });

  it('should return null when ID is not taken', (done) => {
    mockProductApiService.isIdTaken.mockResolvedValue(false);

    const control = { value: 'unique-id' } as AbstractControl;

    validator.validate(control).subscribe(result => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return error when ID is taken', (done) => {
    mockProductApiService.isIdTaken.mockResolvedValue(true);

    const control = { value: 'taken-id' } as AbstractControl;

    validator.validate(control).subscribe(result => {
      expect(result).toEqual({ uniqueId: true });
      done();
    });
  });

  it('should return null on API error', (done) => {
    mockProductApiService.isIdTaken.mockRejectedValue(new Error('API Error'));

    const control = { value: 'error-id' } as AbstractControl;

    validator.validate(control).subscribe(result => {
      expect(result).toBeNull();
      done();
    });
  });
});
