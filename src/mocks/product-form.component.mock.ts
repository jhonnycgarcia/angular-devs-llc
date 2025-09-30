import { Component } from '@angular/core';
import { ProductFormComponent } from '../app/features/product-form/product-form.component';

@Component({
  template: `
    <product-form></product-form>
  `,
  imports: [ProductFormComponent]
})
export class ProductFormComponentMock {}
