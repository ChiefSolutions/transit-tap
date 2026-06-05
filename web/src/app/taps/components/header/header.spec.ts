import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapsListHeader } from './header';
import { By } from '@angular/platform-browser';

describe('Header', () => {
  let component: TapsListHeader;
  let fixture: ComponentFixture<TapsListHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TapsListHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(TapsListHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when there is no connection', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('connected', false);
      fixture.detectChanges();
    });

    it('should rendered the header and show offline state', () => {
      const headerEl = fixture.debugElement.query(By.css('.TapsListHeader-container'));
      const busIconEl = fixture.debugElement.query(By.css('[data-testid="bus-icon"]'));
      const headingEl = fixture.debugElement.query(By.css('.TapsListHeader-heading'));
      const connectionStatusContainerEl = fixture.debugElement.query(
        By.css('.TapsListHeader-liveIndicator'),
      );
      const connectionStatusLabelEl = fixture.debugElement.query(
        By.css('.TapsListHeader-liveIndicatorLabel'),
      );

      expect(headerEl).toBeTruthy();
      expect(busIconEl).toBeTruthy();
      expect(headingEl).toBeTruthy();
      expect(headingEl.nativeElement.textContent).toBe('Transit Tap Event Stream');
      expect(
        connectionStatusContainerEl.nativeElement.classList.contains(
          'TapsListHeader--disconnected',
        ),
      ).toBe(true);
      expect(connectionStatusLabelEl.nativeElement.textContent).toBe('Not connected');
    });
  });

  describe('when there is a connection', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('connected', true);
      fixture.detectChanges();
    });

    it('should show the header in connected state', () => {
      const connectionStatusContainerEl = fixture.debugElement.query(
        By.css('.TapsListHeader-liveIndicator'),
      );
      const connectionStatusLabelEl = fixture.debugElement.query(
        By.css('.TapsListHeader-liveIndicatorLabel'),
      );

      expect(
        connectionStatusContainerEl.nativeElement.classList.contains(
          'TapsListHeader--disconnected',
        ),
      ).toBe(false);
      expect(connectionStatusLabelEl.nativeElement.textContent).toBe('Live stream');
    });
  });
});
