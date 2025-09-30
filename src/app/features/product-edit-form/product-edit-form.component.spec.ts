import { Spectator, createComponentFactory, byTestId } from '@ngneat/spectator';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { faker } from '@faker-js/faker';

import { ProductEditFormComponent } from './product-edit-form.component';
import { ProductApiService } from '@shared/data/product-api.service';
import { Product } from '@shared/models';

// Mock data for testing
const mockProductData: Product = {
  id: faker.string.alphanumeric(8),
  name: faker.commerce.productName(),
  description: faker.lorem.paragraph(),
  logo: faker.internet.url(),
  date_release: faker.date.future().toISOString().split('T')[0],
  date_revision: faker.date.future().toISOString().split('T')[0],
};

// Mocks for dependencies
const mockRouter = {
  navigate: jest.fn()
};

const mockProductApiService = {
  selectedProduct: jest.fn(),
  editProduct: {
    mutateAsync: jest.fn()
  }
};

const mockDomSanitizer = {
  sanitize: jest.fn()
};

describe('ProductEditFormComponent', () => {
  let spectator: Spectator<ProductEditFormComponent>;
  let consoleErrorSpy: jest.SpyInstance;

  const createComponent = createComponentFactory({
    component: ProductEditFormComponent,
    imports: [ReactiveFormsModule],
    providers: [
      { provide: Router, useValue: mockRouter },
      { provide: ProductApiService, useValue: mockProductApiService },
      { provide: DomSanitizer, useValue: mockDomSanitizer }
    ],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    // Mock console.error to prevent test output pollution
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Reset mocks
    jest.clearAllMocks();
    mockProductApiService.editProduct.mutateAsync.mockReturnValue(of({}));
    mockDomSanitizer.sanitize.mockReturnValue('sanitized-url');
    mockProductApiService.selectedProduct.mockReturnValue(mockProductData);
  });

  afterEach(() => {
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  describe('Inicialización', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should initialize form with correct structure', () => {
      expect(spectator.component.form).toBeDefined();
      expect(spectator.component.form.controls['id']).toBeDefined();
      expect(spectator.component.form.controls['name']).toBeDefined();
      expect(spectator.component.form.controls['description']).toBeDefined();
      expect(spectator.component.form.controls['logo']).toBeDefined();
      expect(spectator.component.form.controls['releaseDate']).toBeDefined();
      expect(spectator.component.form.controls['reviewDate']).toBeDefined();
    });

    it('should fill form with selected product data on init', () => {
      spectator.component.ngOnInit();

      expect(spectator.component.form.get('id')?.value).toBe(mockProductData.id);
      expect(spectator.component.form.get('name')?.value).toBe(mockProductData.name);
      expect(spectator.component.form.get('description')?.value).toBe(mockProductData.description);
      expect(spectator.component.form.get('logo')?.value).toBe(mockProductData.logo);
      expect(spectator.component.form.get('releaseDate')?.value).toBe(mockProductData.date_release);
      expect(spectator.component.form.get('reviewDate')?.value).toBe(mockProductData.date_revision);
    });

    it('should navigate to home if no selected product', () => {
      mockProductApiService.selectedProduct.mockReturnValue(null);

      spectator.component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should render form with all inputs', () => {
      expect(spectator.query(byTestId('product-edit-form'))).toBeTruthy();
      expect(spectator.query(byTestId('product-edit-id-input'))).toBeTruthy();
      expect(spectator.query(byTestId('product-edit-name-input'))).toBeTruthy();
      expect(spectator.query(byTestId('product-edit-description-input'))).toBeTruthy();
      expect(spectator.query(byTestId('product-edit-logo-input'))).toBeTruthy();
      expect(spectator.query(byTestId('product-edit-release-date-input'))).toBeTruthy();
      expect(spectator.query(byTestId('product-edit-review-date-input'))).toBeTruthy();
    });

    it('should render action buttons', () => {
      expect(spectator.query(byTestId('cancel-edit-button'))).toBeTruthy();
      expect(spectator.query(byTestId('submit-edit-button'))).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should validate name field - required and length', () => {
      const nameControl = spectator.component.form.get('name');

      nameControl?.setValue('');
      expect(nameControl?.errors?.['required']).toBeTruthy();

      nameControl?.setValue('abc');
      expect(nameControl?.errors?.['minlength']).toBeTruthy();

      nameControl?.setValue('a'.repeat(101));
      expect(nameControl?.errors?.['maxlength']).toBeTruthy();

      nameControl?.setValue('Valid Name');
      expect(nameControl?.valid).toBeTruthy();
    });

    it('should validate description field - required and length', () => {
      const descControl = spectator.component.form.get('description');

      descControl?.setValue('');
      expect(descControl?.errors?.['required']).toBeTruthy();

      descControl?.setValue('abc');
      expect(descControl?.errors?.['minlength']).toBeTruthy();

      descControl?.setValue('a'.repeat(201));
      expect(descControl?.errors?.['maxlength']).toBeTruthy();

      descControl?.setValue('Valid description text');
      expect(descControl?.valid).toBeTruthy();
    });

    it('should validate logo field - required and URL', () => {
      const logoControl = spectator.component.form.get('logo');

      logoControl?.setValue('');
      expect(logoControl?.errors?.['required']).toBeTruthy();

      logoControl?.setValue('invalid-url');
      expect(logoControl?.errors?.['invalidUrl']).toBeTruthy();

      logoControl?.setValue('https://valid.url/image.png');
      expect(logoControl?.valid).toBeTruthy();
    });

    it('should validate releaseDate field - required', () => {
      const dateControl = spectator.component.form.get('releaseDate');

      dateControl?.setValue('');
      expect(dateControl?.errors?.['required']).toBeTruthy();

      dateControl?.setValue('2024-01-01');
      expect(dateControl?.valid).toBeTruthy();
    });
  });

  describe('Date Logic', () => {
    it('should calculate review date as release date + 1 year', () => {
      const releaseDate = '2024-06-15';
      const expectedYear = 2025;
      const expectedMonth = 6;
      const expectedDay = 15;

      spectator.component.form.get('releaseDate')?.setValue(releaseDate);
      spectator.detectChanges();

      const reviewDate = spectator.component.form.get('reviewDate')?.value;
      expect(reviewDate).toBeDefined();

      const [year, month, day] = reviewDate!.split('-').map(Number);
      expect(year).toBe(expectedYear);
      expect(month).toBe(expectedMonth);
      expect(day).toBeGreaterThanOrEqual(expectedDay - 1);
      expect(day).toBeLessThanOrEqual(expectedDay + 1);
    });

    it('should update review date when release date changes', () => {
      spectator.component.form.get('releaseDate')?.setValue('2024-06-01');
      spectator.detectChanges();
      let reviewDate = spectator.component.form.get('reviewDate')?.value;
      expect(reviewDate).toMatch(/^2025-/);

      spectator.component.form.get('releaseDate')?.setValue('2024-12-15');
      spectator.detectChanges();
      reviewDate = spectator.component.form.get('reviewDate')?.value;
      expect(reviewDate).toMatch(/^2025-/);
    });
  });

  describe('Form Submission', () => {
    it('should not submit if form is invalid', async () => {
      spectator.component.form.get('name')?.setValue(''); // Make form invalid

      spectator.click(byTestId('submit-edit-button'));

      expect(mockProductApiService.editProduct.mutateAsync).not.toHaveBeenCalled();
    });

    it('should submit form successfully', async () => {
      spectator.component.ngOnInit(); // Fill form

      await spectator.component.onSubmit();

      expect(mockProductApiService.editProduct.mutateAsync).toHaveBeenCalledWith({
        id: mockProductData.id,
        data: {
          id: mockProductData.id,
          name: mockProductData.name,
          description: mockProductData.description,
          logo: 'sanitized-url',
          date_release: mockProductData.date_release,
          date_revision: expect.any(String)
        }
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle submission error', async () => {
      mockProductApiService.editProduct.mutateAsync.mockRejectedValue(new Error('API Error'));

      spectator.component.ngOnInit();

      await expect(spectator.component.onSubmit()).rejects.toThrow('API Error');
      expect(mockProductApiService.editProduct.mutateAsync).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should disable form during submission', async () => {
      spectator.component.ngOnInit();

      const submitPromise = spectator.component.onSubmit();

      expect(spectator.component.form.disabled).toBeTruthy();
      expect(spectator.component.isLoading()).toBeTruthy();

      await submitPromise;

      expect(spectator.component.form.enabled).toBeTruthy();
      expect(spectator.component.isLoading()).toBeFalsy();
    });
  });

  describe('Form Actions', () => {
    it('should navigate on cancel button click', () => {
      spectator.click(byTestId('cancel-edit-button'));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('UI States', () => {
    it('should show error messages when submitted and invalid', () => {
      spectator.component.form.get('name')?.setValue('');
      spectator.component.submitted.set(true);
      spectator.detectChanges();

      const errorMessages = spectator.queryAll('div.error-message');
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    it('should disable buttons during loading', () => {
      spectator.component.isLoading.set(true);
      spectator.detectChanges();

      const cancelButton = spectator.query(byTestId('cancel-edit-button')) as HTMLButtonElement;
      const submitButton = spectator.query(byTestId('submit-edit-button')) as HTMLButtonElement;

      expect(cancelButton?.disabled).toBeTruthy();
      expect(submitButton?.disabled).toBeTruthy();
    });

    it('should change submit button text during loading', () => {
      spectator.component.isLoading.set(true);
      spectator.detectChanges();

      const submitButton = spectator.query(byTestId('submit-edit-button'));
      expect(submitButton?.textContent?.trim()).toBe('Actualizando...');
    });
  });
});
