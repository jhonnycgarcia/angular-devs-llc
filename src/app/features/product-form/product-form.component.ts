import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { addYears, format } from 'date-fns';

import { ButtonComponent, CardComponent } from '@shared/ui';
import { Product } from '@shared/models';
import { ProductApiService } from '@shared/data/product-api.service';
import { sanitizeUrl, UniqueProductIdValidator, urlValidator } from '@utils/index';
import { NotificationService } from '@shared/data';

@Component({
  selector: 'product-form',
  imports: [
    ButtonComponent,
    CardComponent,
    CommonModule,
    KeyValuePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './product-form.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnInit {

  public currentDate = format(new Date(), 'yyyy-MM-dd');

  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private productApiService = inject(ProductApiService);
  private readonly uniqueProductIdValidator = inject(UniqueProductIdValidator);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly notificationSrv = inject(NotificationService);

  public form: FormGroup = new FormGroup({
    id: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ],
      asyncValidators: [
        this.uniqueProductIdValidator.validate.bind(this.uniqueProductIdValidator)
      ],
      updateOn: 'change',
      nonNullable: true
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
    id: {
      'required': 'El ID es requerido',
      'minlength': 'El ID debe tener al menos 3 caracteres',
      'maxlength': 'El ID no puede tener más de 10 caracteres',
      'pattern': 'El ID debe contener solo letras y números',
      'uniqueId': 'El ID ya está en uso',
    },
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
    this.form.get('releaseDate')!.valueChanges
    .pipe( takeUntilDestroyed(this.destroyRef) )
    .subscribe(value => {
      const reviewDate = format(addYears(new Date(value), 1), 'yyyy-MM-dd');
      this.form.get('reviewDate')!.setValue(reviewDate);
    });

  }

  get f() { return this.form.controls; }

  getVmMessage(field: string, error: string): string {
    return this.vm[field]?.[error] ?? '';
  }

  async onSubmit(): Promise<void> {
    if(!this.submitted()){ this.submitted.set(true); }

    if(!this.form.valid){ return; }

    this.isLoading.set(true);

    try {
      this.form.disable();

      const formData = this.form.value;
      const urlSanatized = sanitizeUrl(this.sanitizer, formData.logo);

      const data: Product = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        logo: urlSanatized ? urlSanatized.toString() : '',
        date_release: formData.releaseDate,
        date_revision: format(addYears(new Date(formData.releaseDate), 1), 'yyyy-MM-dd'),
      };

      await this.productApiService.addProduct.mutateAsync(data);
      this.router.navigate(['/']);

    } catch (error) {
      const message = (error instanceof Error && error.message) || "Server Error";
      this.notificationSrv.showError(message);
      // Handle error
    } finally {
      this.isLoading.set(false);
      this.form.enable();
      this.form.get('reviewDate')!.disable();
    }
  }

  onReset(): void {
    this.form.reset();
    this.form.patchValue({
      releaseDate: this.currentDate,
      reviewDate: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
    }, { emitEvent: false });
    this.submitted.set(false);
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

}
