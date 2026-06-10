import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapsRow } from './taps-row';
import { By } from '@angular/platform-browser';
import { TapEventLabelMap } from '../../../constants';
import { DatePipe } from '@angular/common';
import { TapEvent } from '../../types';
import { mockTapTableRowData } from 'tests/mocks/data';

const testTapRowData = mockTapTableRowData[0];

describe('TapSRow', () => {
  let component: TapsRow;
  let fixture: ComponentFixture<TapsRow>;
  let datePipe: DatePipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TapsRow, DatePipe],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TapsRow);
    fixture.componentRef.setInput('data', testTapRowData);
    component = fixture.componentInstance;
    datePipe = TestBed.inject(DatePipe);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the data', () => {
    const deviceNameEl = fixture.debugElement.query(By.css('[data-testid="taps-row-device-name"]'));
    const timeStampEl = fixture.debugElement.query(By.css('[data-testid="taps-row-device-timestamp"]'));
    const eventEl = fixture.debugElement.query(By.css('[data-testid="taps-row-event"]'));
    const statusEl = fixture.debugElement.query(By.css('[data-testid="taps-row-status"]'));

    expect(deviceNameEl.nativeElement.textContent).toEqual(testTapRowData.deviceName);
    expect(timeStampEl.nativeElement.textContent).toEqual(datePipe.transform(testTapRowData.timestamp, 'mediumTime'));
    expect(eventEl.nativeElement.textContent).toEqual(TapEventLabelMap[testTapRowData.event]);
    expect(eventEl.nativeElement.classList.contains('TapsRow--out')).toBeTruthy();
    expect(statusEl.nativeElement.textContent).toEqual(testTapRowData.status);
    expect(statusEl.nativeElement.classList.contains('TapsRow--declined')).toBeTruthy();
  });

  describe('when the event is tap in', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('data', { ...testTapRowData, event: 'TapIn' as TapEvent });
      fixture.detectChanges();
    });

    it('should set the pill css class for tap in event', () => {
      const eventEl = fixture.debugElement.query(By.css('[data-testid="taps-row-event"]'));

      expect(eventEl.nativeElement.classList.contains('TapsRow--in')).toBeTruthy();
    });
  });

  describe('when the status is declined', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('data', {
        ...testTapRowData,
        event: 'TapIn',
        status: 'Declined',
      });
      fixture.detectChanges();
    });

    it('should set the pill css class for tap in event', () => {
      const statusEl = fixture.debugElement.query(By.css('[data-testid="taps-row-status"]'));

      expect(statusEl.nativeElement.classList.contains('TapsRow--declined')).toBeTruthy();
    });
  });
});
