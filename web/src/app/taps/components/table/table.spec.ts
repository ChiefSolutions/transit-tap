import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapsListTable } from './table';
import { By } from '@angular/platform-browser';
import { findChildElement, getTapsListTableTestChildren } from 'tests/utils';
import { mockTapTableRowData } from 'tests/mocks/data';
import { DebugElement } from '@angular/core';
import { TableSort } from '../../types';

describe('Table', () => {
  let component: TapsListTable;
  let fixture: ComponentFixture<TapsListTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TapsListTable],
    }).compileComponents();

    fixture = TestBed.createComponent(TapsListTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when rendered while data is being fetched', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('data', []);
    });

    it('Should render the table in a loading state', () => {
      const { tableEl, columnEls, deviceNameEl, timestampEl, eventEl, statusEl, noDataLabelEl } = getTapsListTableTestChildren(fixture);

      expect(tableEl.nativeElement).toBeTruthy();
      expect(columnEls.length).toEqual(4);
      expect(deviceNameEl?.nativeElement).toBeTruthy();
      expect(timestampEl?.nativeElement).toBeTruthy();
      expect(eventEl?.nativeElement).toBeTruthy();
      expect(statusEl?.nativeElement).toBeTruthy();
      expect(noDataLabelEl.nativeElement.textContent).toBe('No data to display at the moment.');
    });
  });

  describe('when data is fetched successfully', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('data', mockTapTableRowData);
      fixture.componentRef.setInput('isLoading', false);
      fixture.detectChanges();
    });

    it('Should render the table with data', async () => {
      const noDataLabelEl = fixture.debugElement.query(By.css('.TapsListTable-noDataLabel'));
      const rowDataEls = fixture.debugElement.queryAll(By.css('[data-testid="row-data"]'));

      expect(noDataLabelEl).toBeFalsy();
      expect(rowDataEls.length).toEqual(mockTapTableRowData.length);
    });
  });

  describe('when sorting table columns', () => {
    let result: TableSort | undefined;

    beforeEach(() => {
      vi.spyOn(component, 'onColumnSort');

      component.sortColumn.subscribe((value) => {
        result = value;
      });

      fixture.componentRef.setInput('data', mockTapTableRowData);
      fixture.componentRef.setInput('isLoading', false);
      fixture.detectChanges();
    });

    it('should sort the table column', async () => {
      const columnEls = fixture.debugElement.queryAll(By.css('[data-testid="table-header-colum"]'));
      const firstColumnEl = columnEls.find(findChildElement('Device Name')) as DebugElement;
      const buttonEl = firstColumnEl.nativeElement.querySelector('button') as HTMLButtonElement;

      buttonEl.click();
      fixture.detectChanges();

      expect(component.onColumnSort).toHaveBeenCalledWith('deviceName', expect.any(MouseEvent));
      expect(result).toEqual({ column: 'deviceName', direction: 'asc' });
    });
  });

  describe('when sorting and the column is clicked multiple times', () => {
    let result: TableSort | undefined;

    beforeEach(() => {
      vi.spyOn(component, 'onColumnSort');

      component.sortColumn.subscribe((value) => {
        result = value;
      });

      fixture.componentRef.setInput('data', mockTapTableRowData);
      fixture.componentRef.setInput('isLoading', false);
      fixture.detectChanges();
    });

    it('should sort the table column multiple times', async () => {
      const columnEls = fixture.debugElement.queryAll(By.css('[data-testid="table-header-colum"]'));
      const firstColumnEl = columnEls.find(findChildElement('Device Name')) as DebugElement;
      const buttonEl = firstColumnEl.nativeElement.querySelector('button') as HTMLButtonElement;

      buttonEl.click();
      fixture.detectChanges();

      expect(component.onColumnSort).toHaveBeenCalledWith('deviceName', expect.any(MouseEvent));
      expect(result).toEqual({ column: 'deviceName', direction: 'asc' });

      buttonEl.click();
      fixture.detectChanges();

      expect(component.onColumnSort).toHaveBeenCalledWith('deviceName', expect.any(MouseEvent));
      expect(result).toEqual({ column: 'deviceName', direction: 'desc' });

      buttonEl.click();
      fixture.detectChanges();

      expect(component.onColumnSort).toHaveBeenCalledWith('deviceName', expect.any(MouseEvent));
      expect(result).toEqual({ column: 'deviceName', direction: 'none' });
    });
  });
});
