import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductApiService } from '@shared/data/product-api.service';
import { Product } from '@shared/models';
import { ButtonComponent, CardComponent } from '@shared/ui';
import { sanitizeUrl, urlValidator } from '@utils/index';
import { addYears, format } from 'date-fns';

@Component({
  selector: 'product-edit-form',
  imports: [
    ButtonComponent,
    CardComponent,
    KeyValuePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './product-edit-form.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditFormComponent implements OnInit {

  public currentDate = format(new Date(), 'yyyy-MM-dd');

  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private productApiService = inject(ProductApiService);
  private readonly sanitizer = inject(DomSanitizer);

  public form: FormGroup = new FormGroup({
    id: new FormControl<string>({
      value: '',
      disabled: true
    }),
    name: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ],
      nonNullable: true
    }),
    description: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
      ],
      nonNullable: true
    }),
    logo: new FormControl<string>('', {
      validators: [
        Validators.required,
        urlValidator
      ],
      nonNullable: true
    }),
    releaseDate: new FormControl<string>(this.currentDate, {
      validators: [Validators.required],
      nonNullable: true
    }),
    reviewDate: new FormControl<string>({
      value: format(
        addYears(new Date(), 1),
        'yyyy-MM-dd'
      ),
      disabled: true
    }),
  });

  public vm: any = {
    name: {
      'required': 'El nombre es requerido',
      'minlength': 'El nombre debe tener al menos 5 caracteres',
      'maxlength': 'El nombre no puede tener más de 100 caracteres',
    },
    description: {
      'required': 'La descripción es requerida',
      'minlength': 'La descripción debe tener al menos 10 caracteres',
      'maxlength': 'La descripción no puede tener más de 200 caracteres',
    },
    logo: {
      'required': 'El logo es requerido',
      'invalidUrl': 'El logo debe ser una URL válida con protocolo http o https',
    },
    releaseDate: {
      'required': 'La fecha de liberación es requerida',
    },
  }

  public submitted = signal(false);
  public isLoading = signal(false);

  ngOnInit(): void {
    const product = this.productApiService.selectedProduct();
    if(!product) {
      this.router.navigate(['/']);
      return;
    }

    this.form.get('releaseDate')!.valueChanges
    .pipe( takeUntilDestroyed(this.destroyRef) )
    .subscribe(value => {
      const reviewDate = format(addYears(new Date(value), 1), 'yyyy-MM-dd');
      this.form.get('reviewDate')!.setValue(reviewDate);
    });

    this.fillForm();
  }

  get f() { return this.form.controls; }

  private fillForm(): void {
    const product = this.productApiService.selectedProduct();

    this.form.patchValue({
      id: product!.id,
      name: product!.name,
      description: product!.description,
      logo: product!.logo,
      releaseDate: product!.date_release,
      reviewDate: product!.date_revision,
    }, { emitEvent: false });
  }

  getVmMessage(field: string, error: string): string {
    return this.vm[field]?.[error] ?? '';
  }

  async onSubmit(): Promise<void> {
    if(!this.submitted()){ this.submitted.set(true); }

    if(!this.form.valid){ return; }

    this.isLoading.set(true);

    try {
      this.form.disable();

      const id = this.productApiService.selectedProduct()!.id;
      const formData = this.form.value;
      const urlSanatized = sanitizeUrl(this.sanitizer, formData.logo);

      const data: Product = {
        id: id,
        name: formData.name,
        description: formData.description,
        logo: urlSanatized ? urlSanatized.toString() : '',
        date_release: formData.releaseDate,
        date_revision: format(addYears(new Date(formData.releaseDate), 1), 'yyyy-MM-dd'),
      };

      await this.productApiService.editProduct.mutateAsync({id, data});
      this.router.navigate(['/']);

    } catch (error) {
      throw error;
    } finally {
      this.isLoading.set(false);
      this.form.enable();
      this.form.get('reviewDate')!.disable();
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

}
