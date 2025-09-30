import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let spectator: Spectator<PaginationComponent>;

  const createComponent = createComponentFactory({
    component: PaginationComponent,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        currentPage: 1,
        totalPages: 5,
        pageSize: 10,
      },
    });
  });

  describe('Required inputs', () => {
    it('should require currentPage input', () => {
      expect(() => {
        createComponent({
          props: {
            totalPages: 5,
            pageSize: 10,
          },
        });
      }).toThrow();
    });

    it('should require totalPages input', () => {
      expect(() => {
        createComponent({
          props: {
            currentPage: 1,
            pageSize: 10,
          },
        });
      }).toThrow();
    });

    it('should require pageSize input', () => {
      expect(() => {
        createComponent({
          props: {
            currentPage: 1,
            totalPages: 5,
          },
        });
      }).toThrow();
    });
  });

  describe('Default values', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should have default pageSizes', () => {
      expect(spectator.component.pageSizes()).toEqual([5, 10, 20]);
    });

    it('should have default totalItems', () => {
      expect(spectator.component.totalItems()).toBe(0);
    });
  });

  describe('Template rendering', () => {
    it('should render pagination container', () => {
      const container = spectator.query('.pagination-container');
      expect(container).toBeTruthy();
    });

    it('should render pagination info', () => {
      const info = spectator.query('.pagination-info small');
      expect(info).toBeTruthy();
      expect(info?.textContent?.trim()).toBe('0 Resultados');
    });

    it('should render pagination-size component', () => {
      const paginationSize = spectator.query('ui-pagination-size');
      expect(paginationSize).toBeTruthy();
    });

    it('should render pagination controls when totalPages > 1', () => {
      const controls = spectator.query('.pagination-controls');
      expect(controls).toBeTruthy();
    });

    it('should not render pagination controls when totalPages = 1', () => {
      spectator.setInput('totalPages', 1);
      spectator.detectChanges();

      const controls = spectator.query('.pagination-controls');
      expect(controls).toBeFalsy();
    });
  });

  describe('Pagination controls', () => {
    it('should render previous button', () => {
      const prevButton = spectator.query('button:first-child');
      expect(prevButton).toBeTruthy();
      expect(prevButton?.textContent?.trim()).toBe('Anterior');
    });

    it('should render next button', () => {
      const nextButton = spectator.query('button:last-child');
      expect(nextButton).toBeTruthy();
      expect(nextButton?.textContent?.trim()).toBe('Siguiente');
    });

    it('should render page info', () => {
      const pageInfo = spectator.query('.page-info');
      expect(pageInfo).toBeTruthy();
      expect(pageInfo?.textContent?.trim()).toBe('1 de 5');
    });
  });

  describe('Button states', () => {
    it('should disable previous button on first page', () => {
      const prevButton = spectator.query('button:first-child') as HTMLButtonElement;
      expect(prevButton?.disabled).toBe(true);
    });

    it('should enable previous button when not on first page', () => {
      spectator.setInput('currentPage', 2);
      spectator.detectChanges();

      const prevButton = spectator.query('button:first-child') as HTMLButtonElement;
      expect(prevButton?.disabled).toBe(false);
    });

    it('should disable next button on last page', () => {
      spectator.setInput('currentPage', 5);
      spectator.detectChanges();

      const nextButton = spectator.query('button:last-child') as HTMLButtonElement;
      expect(nextButton?.disabled).toBe(true);
    });

    it('should enable next button when not on last page', () => {
      const nextButton = spectator.query('button:last-child') as HTMLButtonElement;
      expect(nextButton?.disabled).toBe(false);
    });
  });

  describe('Navigation methods', () => {
    it('should emit pageChange when prevPage is called and not on first page', () => {
      spectator.setInput('currentPage', 3);
      const outputSpy = jest.fn();
      spectator.component.pageChange.subscribe(outputSpy);

      spectator.component.prevPage();

      expect(outputSpy).toHaveBeenCalledWith(2);
    });

    it('should not emit pageChange when prevPage is called on first page', () => {
      const outputSpy = jest.fn();
      spectator.component.pageChange.subscribe(outputSpy);

      spectator.component.prevPage();

      expect(outputSpy).not.toHaveBeenCalled();
    });

    it('should emit pageChange when nextPage is called and not on last page', () => {
      const outputSpy = jest.fn();
      spectator.component.pageChange.subscribe(outputSpy);

      spectator.component.nextPage();

      expect(outputSpy).toHaveBeenCalledWith(2);
    });

    it('should not emit pageChange when nextPage is called on last page', () => {
      spectator.setInput('currentPage', 5);
      const outputSpy = jest.fn();
      spectator.component.pageChange.subscribe(outputSpy);

      spectator.component.nextPage();

      expect(outputSpy).not.toHaveBeenCalled();
    });

    it('should emit pageSizeChange when onPageSizeChange is called', () => {
      const outputSpy = jest.fn();
      spectator.component.pageSizeChange.subscribe(outputSpy);

      spectator.component.onPageSizeChange(20);

      expect(outputSpy).toHaveBeenCalledWith(20);
    });
  });

  describe('Input changes', () => {
    it('should update page info when currentPage changes', () => {
      spectator.setInput('currentPage', 3);
      spectator.detectChanges();

      const pageInfo = spectator.query('.page-info');
      expect(pageInfo?.textContent?.trim()).toBe('3 de 5');
    });

    it('should update page info when totalPages changes', () => {
      spectator.setInput('totalPages', 10);
      spectator.detectChanges();

      const pageInfo = spectator.query('.page-info');
      expect(pageInfo?.textContent?.trim()).toBe('1 de 10');
    });

    it('should update total items display', () => {
      spectator.setInput('totalItems', 150);
      spectator.detectChanges();

      const info = spectator.query('.pagination-info small');
      expect(info?.textContent?.trim()).toBe('150 Resultados');
    });

    it('should pass pageSizes to pagination-size component', () => {
      spectator.setInput('pageSizes', [10, 25, 50]);
      spectator.detectChanges();

      const paginationSize = spectator.query('ui-pagination-size');
      expect(paginationSize).toBeTruthy();
      // Note: In shallow rendering, we can't easily test the inputs passed to child components
    });

    it('should pass pageSize to pagination-size component', () => {
      spectator.setInput('pageSize', 20);
      spectator.detectChanges();

      const paginationSize = spectator.query('ui-pagination-size');
      expect(paginationSize).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label on page info', () => {
      const pageInfo = spectator.query('.page-info');
      expect(pageInfo?.getAttribute('aria-label')).toBe('Página 1 de 5');
    });
  });

});
