import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { AlertComponent } from './alert.component';
import { AlertComponentMock } from '@mocks/alert.component.mock';

describe('AlertComponent', () => {
  let spectator: Spectator<AlertComponentMock>;

  const createComponent = createComponentFactory({
    component: AlertComponentMock,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    const component = spectator.query(AlertComponent);
    expect(component).toBeTruthy();
  });

  it('should render with default type success', () => {
    const component = spectator.query(AlertComponent);
    expect(component?.type).toBe('success');

    const alertElement = spectator.query('[data-testid="alert"]');
    expect(alertElement?.classList.contains('success')).toBe(true);
  });

  it('should apply danger class when type is danger', () => {
    spectator.component.type = 'danger';
    spectator.detectChanges();

    const alertElement = spectator.query('[data-testid="alert"]');
    expect(alertElement?.classList.contains('danger')).toBe(true);
    expect(alertElement?.classList.contains('success')).toBe(false);
  });

  it('should display projected content', () => {
    const alertElement = spectator.query('[data-testid="alert"]');
    expect(alertElement?.textContent?.trim()).toBe('Alerta de Prueba');
  });
});
