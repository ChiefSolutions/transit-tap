import { TestBed, waitForAsync } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TapEventsService } from './tap-events.service';
import { MockEventSource } from 'tests/mocks/event-source.mock';
import { TapTableRow } from '../types';
import { mockTapEventsResponse, mockSummary, mockTapTableRowData } from 'tests/mocks/data';

const EventSourceMock = vi.fn(MockEventSource);
const testTap = mockTapEventsResponse[0].tap;

describe('TapEventsService', () => {
  let service: TapEventsService;

  beforeEach(() => {
    vi.stubGlobal('EventSource', EventSourceMock);

    service = TestBed.inject(TapEventsService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting events', () => {
    const rows: TapTableRow[] = [];
    let summary = {
      total: 0,
      tapIns: 0,
      tapOuts: 0,
      declined: 0,
      errors: 0,
    };

    beforeEach(() => {
      service.getEvents().subscribe((data) => {
        rows.push(data.tap);
        summary = data.summary;
      });
    });

    it('should transform and emit incoming stream events', () => {
      const instance = EventSourceMock.mock.instances[0];
      const testRowTap = mockTapTableRowData[0];

      instance.onopen();
      instance.onmessage({
        data: JSON.stringify({
          tap: testTap,
          summary: mockSummary,
        }),
      });

      console.log('LOG_DATA: ', rows[0], testRowTap);

      expect(rows[0]).toEqual({
        eventId: testRowTap.eventId,
        deviceName: testRowTap.deviceName,
        timestamp: testRowTap.timestamp,
        event: testRowTap.event,
        status: testRowTap.status,
      });

      expect(summary).toEqual(mockSummary);
    });
  });

  describe('when on close is dispatched', () => {
    let completed = false;

    beforeEach(() => {
      service.getEvents().subscribe({ complete: () => (completed = true) });
    });

    it('should close the event', async () => {
      const instance = EventSourceMock.mock.instances[0];

      instance.dispatchCustomEvent('close');

      waitForAsync(async () => {
        expect(completed).toBe(true);
        expect(instance.close).toHaveBeenCalled();
      });
    });
  });

  describe('when on error occurs when connection is open', () => {
    let openError: string | undefined;

    beforeEach(() => {
      service.getEvents().subscribe({
        error: (event) => {
          openError = event.type;
        },
      });
    });

    it('should close the event', async () => {
      const instance = EventSourceMock.mock.instances[EventSourceMock.mock.instances.length - 1];

      instance.readyState = 1;
      instance.onerror(new Event('Open error'));

      expect(instance.close).toHaveBeenCalled();
      expect(openError).toBe('Open error');
    });
  });

  describe('when an error occurs but the connection is already closed', () => {
    let closedError: string | undefined;

    beforeEach(() => {
      service.getEvents().subscribe({
        error: (event: Event) => {
          closedError = event.type;
        },
      });
    });

    it('should not close the event', async () => {
      const instance = EventSourceMock.mock.instances[EventSourceMock.mock.instances.length - 1];

      instance.readyState = 2;
      instance.onerror(new Event('Close error'));

      expect(instance.close).not.toHaveBeenCalled();
      expect(closedError).toBe(undefined);
    });
  });

  describe('when an error occurs while connecting', () => {
    let connectingError: string | undefined;

    beforeEach(() => {
      service.getEvents().subscribe({
        error: (error: Event) => {
          connectingError = error.type;
        },
      });
    });

    it('should not close the event', async () => {
      const instance = EventSourceMock.mock.instances[EventSourceMock.mock.instances.length - 1];

      instance.readyState = 0;
      instance.onerror(new Event('Connecting error'));

      expect(instance.close).to.toHaveBeenCalled();
      expect(connectingError).toBe('Connecting error');
    });
  });
});
