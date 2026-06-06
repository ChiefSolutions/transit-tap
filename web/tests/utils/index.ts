import { DebugElement } from '@angular/core';
import { TapsListHeader, TapsStats, TapsListTable } from '../../src/app/taps/components';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { TapsList, TapActions } from '../../src/app/taps';
import { TapResponse, TapTableRow, TapRowWithStats, TableSort } from '../../src/app/taps/types';
// import { mockTapEventsResponse } from 'tests/mocks/data';
import { initialState, TapState } from '../../src/app/taps/+state/tap.reducer';
import { Action, ActionReducer } from '@ngrx/store';

export const mapTapEventResponse = (response: TapResponse): TapTableRow => {
  const { tap } = response;
  const { deviceName, event, eventId, status, timestamp } = tap;

  return { deviceName, event, eventId, status, timestamp };
};

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

export const isRowDataSorted = (collection: TapTableRow[], sort: TableSort) => {
  return collection.every((val, i, arr) => {
    if (i === 0) return true;

    const previous = arr[i - 1][sort.column];
    const current = val[sort.column];

    return sort.direction === 'asc' ? previous <= current : previous >= current;
  });
};

export const dispatchTestReducerActions = (data: TapResponse[], reducer: ActionReducer<TapState>, sort: TableSort) => {
  let eventReceivedAction: TapRowWithStats & Action<'[Tap Domain] eventReceived'>;
  let state: TapState;

  const response = data.slice(0, 3);
  const rowData = response.map(mapTapEventResponse);

  const sortAction: TableSort & Action<'[Tap Domain] sort'> = TapActions.sort(sort);
  eventReceivedAction = TapActions.eventReceived({ tap: rowData[0], summary: response[0].summary });

  state = reducer(initialState, eventReceivedAction);
  state = reducer(state, sortAction);
  eventReceivedAction = TapActions.eventReceived({ tap: rowData[1], summary: response[1].summary });
  state = reducer(state, eventReceivedAction);
  eventReceivedAction = TapActions.eventReceived({ tap: rowData[2], summary: response[2].summary });

  return { eventReceivedAction, state };
};
