import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/index').then(m => m.ProductListComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/index').then(m => m.ProductFormComponent),
  },
  {
    path: 'edit',
    loadComponent: () => import('./features/index').then(m => m.ProductEditFormComponent),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];
