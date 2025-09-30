import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { catchError, from, map, Observable, of } from "rxjs";
import { inject, Injectable } from "@angular/core";

import { ProductApiService } from "@shared/data/product-api.service";

@Injectable({providedIn: 'root'})
export class UniqueProductIdValidator implements AsyncValidator {

  private readonly productApi = inject(ProductApiService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return from(
      this.productApi.isIdTaken(control.value)
    ).pipe(
      map((isTaken) => (isTaken ? {uniqueId: true} : null)),
      catchError(() => of(null)),
    );
  }
}
