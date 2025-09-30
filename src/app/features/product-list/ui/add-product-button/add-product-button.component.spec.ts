import { SpectatorRouting, createRoutingFactory, byTestId } from '@ngneat/spectator/jest';

import { AddProductButtonComponent } from './add-product-button.component';

describe('AddProductButtonComponent', () => {
  let spectator: SpectatorRouting<AddProductButtonComponent>;

  const createComponent = createRoutingFactory({
    component: AddProductButtonComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render a button with the correct text', () => {
    const button = spectator.query(byTestId('add-product-button'));
    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toBe('Agregar');
  });

  it('should have routerLink directive', () => {
    const button = spectator.query(byTestId('add-product-button'));
    expect(button?.hasAttribute('routerLink')).toBe(true);
  });

  it('should render the plus icon', () => {
    const icon = spectator.query(byTestId('add-product-icon'));
    expect(icon).toBeTruthy();
  });

  it('should have the correct aria-label', () => {
    const button = spectator.query(byTestId('add-product-button'));
    expect(button?.getAttribute('aria-label')).toBe('Agregar nuevo producto');
  });
});
