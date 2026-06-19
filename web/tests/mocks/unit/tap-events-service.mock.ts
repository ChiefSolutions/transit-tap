import { vi, Mock } from 'vitest';

export class TapEventsServiceMock {
  getEvents: Mock;

  constructor() {
    this.getEvents = vi.fn();
  }
}
