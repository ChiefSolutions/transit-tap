import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError, Subject } from 'rxjs';
import { beforeEach, describe, it, expect } from 'vitest';
import { TapEffects } from './tap.effects';
import { TapActions } from './tap.actions';
import { TapEventsService } from '../services/tap-events.service';
import { TapEventsServiceMock } from 'tests/mocks/unit/tap-events-service.mock';
import { mockSummary, mockTapTableRowData } from 'tests/mocks/data';
import { TapRowWithStats } from '../types';

describe('TapEffects - connectTapStream$', () => {
  let effects: TapEffects;
  let actions$: Observable<Action>;
  const tapServiceMock: TapEventsServiceMock = new TapEventsServiceMock();
  const mockTap = { tap: mockTapTableRowData[5], summary: mockSummary };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TapEffects, provideMockActions(() => actions$), { provide: TapEventsService, useValue: tapServiceMock }],
    });

    effects = TestBed.inject(TapEffects);
  });

  describe('when an event is received', () => {
    beforeEach(() => {
      tapServiceMock.getEvents.mockReturnValue(of(mockTap));
      actions$ = of(TapActions.connectStream());
    });

    it('should map incoming stream data to eventReceived actions', () => {
      const sub = effects.connectTapStream$.subscribe((action) => {
        expect(action).toEqual(TapActions.eventReceived(mockTap));
      });

      sub.unsubscribe();
    });
  });

  describe('when stream error occurs', () => {
    beforeEach(() => {
      tapServiceMock.getEvents.mockReturnValue(throwError(() => new Error('Connection dropped')));
      actions$ = of(TapActions.connectStream());
    });

    it('should catch stream errors and map them to streamError actions', () => {
      effects.connectTapStream$.subscribe((action) => {
        expect(action).toEqual(TapActions.streamError({ error: new Error('Connection dropped') }));
      });
    });
  });

  describe('when disconnect stream is dispatched', () => {
    const streamSubject = new Subject<TapRowWithStats>();

    beforeEach(() => {
      tapServiceMock.getEvents.mockReturnValue(streamSubject.asObservable());
    });

    it('should terminate the active event stream when disconnectStream is dispatched', () => {
      const actionSubject = new Subject<Action>();
      actions$ = actionSubject.asObservable();

      let emissionCount = 0;
      effects.connectTapStream$.subscribe({
        next: () => emissionCount++,
      });

      actionSubject.next(TapActions.connectStream());
      streamSubject.next(mockTap);
      expect(emissionCount).toBe(1);

      actionSubject.next(TapActions.disconnectStream());

      streamSubject.next(mockTap);

      expect(emissionCount).toBe(1);
      expect(streamSubject.observed).toBe(false);
    });
  });
});
