import { TestBed, waitForAsync } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TapEventsService } from './tap-events.service';
import { MockEventSource } from '__mock__/event-source.mock';
import { TapTableRow } from '../models';
import { mockTapEventsResponse, mockSummary } from '__mock__/data';

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

      instance.onopen();
      instance.onmessage({
        data: JSON.stringify({
          tap: testTap,
          summary: mockSummary,
        }),
      });

      expect(rows[0]).toEqual({
        eventId: testTap.eventId,
        deviceName: testTap.deviceName,
        timestamp: testTap.timestamp,
        event: testTap.event,
        status: testTap.status,
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
    beforeEach(() => {
      service.getEvents().subscribe({
        error: () => {
          // Intentional no-op: TODO: // implement error handling tests
        },
      });
    });

    it('should close the event', async () => {
      const instance = EventSourceMock.mock.instances[0];

      instance.readyState = 1;
      instance.onerror();

      expect(instance.close).toHaveBeenCalled();
    });
  });

  describe('when an error occurs but the connection is already closed', () => {
    beforeEach(() => {
      service.getEvents().subscribe({
        error: () => {
          // Intentional no-op: TODO: // implement error handling tests
        },
      });
    });

    it('should not close the event', async () => {
      const instance = EventSourceMock.mock.instances[0];

      instance.readyState = 2;
      instance.onerror();

      expect(instance.close).not.to.toBeUndefined();
    });
  });
});
