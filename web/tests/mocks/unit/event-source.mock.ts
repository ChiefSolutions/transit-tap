import { vi } from 'vitest';

export class MockEventSource {
  url: string;
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 2;

  onopen: () => void;
  onerror: (error: Event) => void;
  onmessage: (event: { data: string }) => void;
  dispatchCustomEvent: (type: string) => void;
  addEventListener: (type: string, listener: () => void) => void;
  readyState = 0;

  private listeners: Record<string, () => void> = {};

  constructor(url: string) {
    this.url = url;
    this.onerror = vi.fn();
    this.onmessage = vi.fn();
    this.onopen = vi.fn(() => {
      this.readyState = MockEventSource.OPEN;
    });
    this.dispatchCustomEvent = vi.fn((type: string) => {
      this.listeners[type]?.();
    });
    this.addEventListener = vi.fn((type: string, listener: () => void) => {
      this.listeners[type] = listener;
    });
  }

  close = vi.fn(() => {
    this.readyState = MockEventSource.CLOSED;
  });
}
