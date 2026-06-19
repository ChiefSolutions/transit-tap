import { TestBed, waitForAsync } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TapEventsService } from './tap-events.service';
import { MockEventSource } from 'tests/mocks/unit/event-source.mock';
import { TapTableRow } from '../types';
import { mockTapEventsResponse, mockSummary, mockTapTableRowData } from 'tests/mocks/data';
import { getDefaultTapEventsSummary } from '../utils';

const EventSourceMock = vi.fn(MockEventSource);
const eventSourceError = new Event('error');
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
    let summary = getDefaultTapEventsSummary();

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

  describe('when no data is sent as part of the response', () => {
    const rows: TapTableRow[] = [];

    beforeEach(() => {
      service.getEvents().subscribe((data) => {
        rows.push(data.tap);
      });
    });

    it('should fail and catch the error gracefully', () => {
      const instance = EventSourceMock.mock.instances[EventSourceMock.mock.instances.length - 1];

      instance.onopen();
      instance.onmessage({ data: undefined } as unknown as { data: string });

      expect(rows.length).toEqual(0);
    });
  });

  describe('when corrupted json is sent as part of the response', () => {
    const rows: TapTableRow[] = [];

    beforeEach(() => {
      service.getEvents().subscribe((data) => {
        rows.push(data.tap);
      });
    });

    it('should fail and catch the error gracefully', () => {
      const instance = EventSourceMock.mock.instances[EventSourceMock.mock.instances.length - 1];
      const corruptJson = `{ deviceName: "Device_01", event: "click", status: "active" }`;
      instance.onopen();
      instance.onmessage({ data: corruptJson } as unknown as { data: string });

      expect(rows.length).toEqual(0);
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

  describe('when an error occurs but the connection is already closed', () => {
    let closedError: string | undefined;

    beforeEach(() => {
      service.getEvents().subscribe({
        error: (event: Error) => {
          closedError = event.message;
        },
      });
    });

    it('should close the event', async () => {
      const instance = EventSourceMock.mock.instances[EventSourceMock.mock.instances.length - 1];

      instance.readyState = 2;
      instance.onerror(eventSourceError);

      expect(instance.close).toHaveBeenCalled();
      expect(closedError).toBe('SSE connection permanently closed.');
    });
  });

  describe('when an error occurs while connecting', () => {
    let connectingError: string | undefined;

    beforeEach(() => {
      service.getEvents().subscribe({
        error: (error: Error) => {
          connectingError = error.message;
        },
      });
    });

    it('should not close the event', async () => {
      const instance = EventSourceMock.mock.instances[EventSourceMock.mock.instances.length - 1];

      instance.readyState = 0;
      for (let i = 0; i < 5; i++) {
        instance.onerror(new Event('error'));
      }

      expect(instance.close).to.toHaveBeenCalled();
      expect(connectingError).toBe('API server is completely offline.');
    });
  });
});
