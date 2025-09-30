import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { ApiResponse, Product } from '@shared/models';
import { sleep } from 'src/app/utils/utils';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  private apiUrl = environment.apiUrl;
  private baseUrl = `${this.apiUrl}/products`;

  /* Producto seleccionado por el usuario */
  public selectedProduct = signal<Product | null>(null);

  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);

  public products = injectQuery(() => ({
    queryKey: ['products'],
    queryFn: () => this.getProducts(),
  }));

  public addProduct = injectMutation(() => ({
    mutationFn: (product: Product) => this.createProduct(product),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  }));

  public removeProduct = injectMutation(() => ({
    mutationFn: (id: string) => this.deleteProduct(id),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  }));

  public editProduct = injectMutation(() => ({
    mutationFn: ({ id, data }: { id: string, data: Product }) => this.updateProduct(id, data),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  }))

  public async isIdTaken(id: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/verification/${id}`;
      const response = await lastValueFrom(
        this.http.get<boolean>(url)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async createProduct(product: Product): Promise<Product> {
    try {
      const response = await lastValueFrom(
        this.http.post<ApiResponse<Product>>(this.baseUrl, product)
      );
      return response.data!;

    } catch (error) {
      throw error;
    }
  }

  public async getProducts(): Promise<Product[]> {
    try {
      const { data } = await lastValueFrom(
        this.http.get<ApiResponse<Product[]>>(this.baseUrl)
      );
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  public async deleteProduct(id: string): Promise<string> {
    try {
      const url = `${this.baseUrl}/${id}`;
      const response = await lastValueFrom(
        this.http.delete<ApiResponse<string>>(url)
      );
      return response.message;
    } catch (error) {
      throw error;
    }
  }

  public async updateProduct(id: string, data: Product): Promise<string> {
    try {
      const url = `${this.baseUrl}/${id}`;
      const response = await lastValueFrom(
        this.http.put<ApiResponse<Product>>(url, data)
      );
      return response.message;
    } catch (error) {
      throw error;
    }
  }

}
