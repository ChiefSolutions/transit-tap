import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TapsList } from './taps-list';
import { TapsStats } from './components/stats/taps-stats';
import { initialState, selectRows, selectIsLoading, selectIsConnected } from './+state/tap.reducer';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { mockTapTableRowData } from '__mock__/data';

const findChildElement = (text: string) => {
  return (de: DebugElement) => de.nativeElement.textContent.trim() === text;
};
describe('TapsList', () => {
  let component: TapsList;
  let mockStore: MockStore;
  let fixture: ComponentFixture<TapsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        // other providers
      ],
      imports: [TapsStats],
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TapsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when there is no connection', () => {
    it('Should stream and render the data', () => {
      const headerEl = fixture.debugElement.query(By.css('.TapsList-header'));
      const busIconEl = fixture.debugElement.query(By.css('[data-testid="bus-icon"]'));
      const headingEl = fixture.debugElement.query(By.css('.TapsList-heading'));
      const connectionStatusContainerEl = fixture.debugElement.query(
        By.css('.TapsList-liveIndicator'),
      );
      const connectionStatusLabelEl = fixture.debugElement.query(
        By.css('.TapsList-liveIndicatorLabel'),
      );
      const appStatsComponent = fixture.debugElement.query(
        By.css('[data-testid="app-taps-stats"]'),
      );
      const tableComponent = fixture.debugElement.query(By.css('.TapsList-table'));
      const columnEls = fixture.debugElement.queryAll(By.css('[data-testid="table-header-colum"]'));
      const deviceNameEl = columnEls.find(findChildElement('Device Name'));
      const timestampEl = columnEls.find(findChildElement('Timestamp'));
      const eventEl = columnEls.find(findChildElement('Event'));
      const statusEl = columnEls.find(findChildElement('Status'));
      const noDataLabelEl = fixture.debugElement.query(By.css('.TapsList-noDataLabel'));

      expect(headerEl).toBeTruthy();
      expect(busIconEl).toBeTruthy();
      expect(headingEl).toBeTruthy();
      expect(headingEl.nativeElement.textContent).toBe('Transit Tap Event Stream');
      expect(
        connectionStatusContainerEl.nativeElement.classList.contains('TapsList--disconnected'),
      ).toBe(true);
      expect(connectionStatusLabelEl.nativeElement.textContent).toBe('Not connected');
      expect(appStatsComponent.nativeElement).toBeTruthy();
      expect(tableComponent.nativeElement).toBeTruthy();
      expect(columnEls.length).toEqual(4);
      expect(deviceNameEl?.nativeElement).toBeTruthy();
      expect(timestampEl?.nativeElement).toBeTruthy();
      expect(eventEl?.nativeElement).toBeTruthy();
      expect(statusEl?.nativeElement).toBeTruthy();
      expect(noDataLabelEl.nativeElement.textContent).toBe('No data to display at the moment.');
    });
  });

  describe('when there a connection but data is fetching', () => {
    beforeEach(() => {
      mockStore.overrideSelector(selectRows, []);
      mockStore.overrideSelector(selectIsLoading, true);
      mockStore.overrideSelector(selectIsConnected, false);
      mockStore.refreshState();
      fixture.detectChanges();
    });

    it('Should show the loading state', async () => {
      const loaderEl = fixture.debugElement.query(By.css('.TapsList-loader'));
      const noDataLabelEl = fixture.debugElement.query(By.css('.TapsList-noDataLabel'));

      expect(loaderEl).toBeTruthy();
      expect(noDataLabelEl.nativeElement.textContent).toBe('No data to display at the moment.');
    });
  });

  describe('when there a connection with data stream', () => {
    beforeEach(() => {
      mockStore.overrideSelector(selectRows, mockTapTableRowData);
      mockStore.overrideSelector(selectIsLoading, false);
      mockStore.overrideSelector(selectIsConnected, true);
      mockStore.refreshState();
      fixture.detectChanges();
    });

    it('Should render the list', async () => {
      const loaderEl = fixture.debugElement.query(By.css('.TapsList-loader'));
      const loaderElAfterUpdate = fixture.debugElement.query(By.css('.TapsList-loader'));
      const connectionStatusContainerEl = fixture.debugElement.query(
        By.css('.TapsList-liveIndicator'),
      );
      const connectionStatusLabelEl = fixture.debugElement.query(
        By.css('.TapsList-liveIndicatorLabel'),
      );
      const noDataLabelEl = fixture.debugElement.query(By.css('.TapsList-noDataLabel'));
      const rowDataEls = fixture.debugElement.queryAll(By.css('[data-testid="row-data"]'));

      expect(loaderEl).toBeFalsy();

      expect(loaderElAfterUpdate).toBeFalsy();
      expect(noDataLabelEl).toBeFalsy();
      expect(connectionStatusLabelEl.nativeElement.textContent).toBe('Live stream');
      expect(connectionStatusContainerEl.nativeElement.classList.contains('TapsList--live')).toBe(
        true,
      );
      expect(rowDataEls.length).toEqual(mockTapTableRowData.length);
    });
  });
});
