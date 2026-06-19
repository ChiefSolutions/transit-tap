import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapsStats } from './taps-stats';
import { By } from '@angular/platform-browser';
import { getDefaultTapEventsSummary } from '../../utils';
import { Mock } from 'vitest';

describe('TapsStats', () => {
  let component: TapsStats;
  let fixture: ComponentFixture<TapsStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TapsStats],
    }).compileComponents();

    fixture = TestBed.createComponent(TapsStats);
    fixture.componentRef.setInput('summary', getDefaultTapEventsSummary());
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the component is rendered with no data', () => {
    it('should should show the stats summary without stat counts', () => {
      const containerEls = fixture.debugElement.queryAll(By.css('.TapsStats-stat'));
      const labelEls = fixture.debugElement.queryAll(By.css('[data-testid="stats-label"]'));
      const valueEls = fixture.debugElement.queryAll(By.css('.TapsStats-value'));

      expect(containerEls.length).toEqual(4);
      expect(labelEls.length).toEqual(4);
      expect(valueEls.length).toEqual(4);
      expect(containerEls[0].nativeElement.children.length).toEqual(2);
      expect(labelEls[0].nativeElement.textContent).toBe('Total events');
      expect(labelEls[1].nativeElement.textContent).toBe('Tap ins');
      expect(labelEls[2].nativeElement.textContent).toBe('Tap outs');
      expect(labelEls[3].nativeElement.textContent).toBe('Declined');
      expect(valueEls[0].nativeElement.textContent).toBe('0');
      expect(valueEls[1].nativeElement.textContent).toBe('0');
      expect(valueEls[2].nativeElement.textContent).toBe('0');
      expect(valueEls[3].nativeElement.textContent).toBe('0');
    });
  });

  describe('when the component is rendered with data', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('summary', {
        total: 6,
        tapIns: 2,
        tapOuts: 4,
        declined: 2,
        errors: 0,
      });
      fixture.detectChanges();
    });

    it('should should show the stats summary with stat counts', () => {
      const valueEls = fixture.debugElement.queryAll(By.css('.TapsStats-value'));

      expect(valueEls[0].nativeElement.textContent).toBe('6');
      expect(valueEls[1].nativeElement.textContent).toBe('2');
      expect(valueEls[2].nativeElement.textContent).toBe('4');
      expect(valueEls[3].nativeElement.textContent).toBe('2');
    });
  });

  describe('when filtering is emitted', () => {
    let filterSpy: Mock;

    beforeEach(() => {
      filterSpy = vi.spyOn(component.filterTable, 'emit');
    });

    it('should emit event for each stat', async () => {
      const buttons = fixture.debugElement.queryAll(By.css('[data-testid="stat-button"]'));

      for (const button of buttons) {
        const buttonElement = button.nativeElement as HTMLButtonElement;

        buttonElement.click();
        fixture.detectChanges();

        expect(filterSpy).toHaveBeenCalledWith({ event: expect.any(MouseEvent), name: buttonElement.name });
        filterSpy.mockClear();
      }
    });
  });
});
