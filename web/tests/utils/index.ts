import { DebugElement } from '@angular/core';
import { TapsListHeader, TapsStats, TapsListTable } from '../../src/app/taps/components';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { TapsList } from '../../src/app/taps';

export const findChildElement = (text: string) => {
  return (de: DebugElement) => de.nativeElement.textContent.trim() === text;
};

export const getTapsListTestChildren = (fixture: ComponentFixture<TapsList>) => {
  const headerDebugEl = fixture.debugElement.query(By.directive(TapsListHeader));
  const statsDebugEl = fixture.debugElement.query(By.directive(TapsStats));
  const tableDebugEl = fixture.debugElement.query(By.directive(TapsListTable));
  const headerInstance = headerDebugEl.componentInstance as TapsListHeader;
  const statsInstance = statsDebugEl.componentInstance as TapsStats;
  const tableInstance = tableDebugEl.componentInstance as TapsListTable;

  return {
    headerDebugEl,
    statsDebugEl,
    tableDebugEl,
    headerInstance,
    statsInstance,
    tableInstance,
  };
};

export const getTapsListTableTestChildren = (fixture: ComponentFixture<TapsListTable>) => {
  const tableEl = fixture.debugElement.query(By.css('.TapsListTable-table'));
  const columnEls = fixture.debugElement.queryAll(By.css('[data-testid="table-header-colum"]'));
  const deviceNameEl = columnEls.find(findChildElement('Device Name'));
  const timestampEl = columnEls.find(findChildElement('Timestamp'));
  const eventEl = columnEls.find(findChildElement('Event'));
  const statusEl = columnEls.find(findChildElement('Status'));
  const noDataLabelEl = fixture.debugElement.query(By.css('.TapsListTable-noDataLabel'));

  return { tableEl, columnEls, deviceNameEl, timestampEl, eventEl, statusEl, noDataLabelEl };
};
