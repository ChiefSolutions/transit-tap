import { Injectable, NgZone, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TapTableRow, TapResponse, TapRowWithStats } from '../types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TapEventsService {
  private readonly ngZone = inject(NgZone);
  private readonly API_URL = `${environment.apiUrl}/taps`;

  getEvents(): Observable<TapRowWithStats> {
    return new Observable((observer) => {
      console.log('Connecting to stream...');

      let eventSource: EventSource | null = null;
      let retryCount = 0;
      const MAX_RETRIES = 5;

      this.ngZone.runOutsideAngular(() => {
        eventSource = new EventSource(this.API_URL);

        eventSource.onopen = () => {
          console.log('Successfully connected to the stream!');
        };

        eventSource.onmessage = (message: MessageEvent<string>) => {
          if (!message.data || message.data.trim() === '') return;

          try {
            const data: TapResponse = JSON.parse(message.data);
            const { tap, summary } = data;
            const { deviceName, event, eventId, status, timestamp } = tap;
            const row: TapTableRow = { deviceName, event, eventId, status, timestamp };

            this.ngZone.run(() => {
              observer.next({ tap: row, summary });
            });
          } catch (err) {
            console.error('Failed to parse SSE JSON payload data:', err);
          }
        };

        eventSource.onerror = () => {
          if (eventSource?.readyState === EventSource.CLOSED) {
            console.log('Stream permanently closed by server or client.');
            this.ngZone.run(() => {
              observer.error(new Error('SSE connection permanently closed.'));
              observer.complete();
            });
            return;
          }

          if (eventSource?.readyState === EventSource.CONNECTING) {
            retryCount++;
            console.warn(`API connection lost. Attempting auto-retry (${retryCount}/${MAX_RETRIES})...`);

            if (retryCount >= MAX_RETRIES) {
              console.error('API remains unreachable. Force-closing live stream connection.');

              this.ngZone.run(() => {
                observer.error(new Error('API server is completely offline.'));
                observer.complete();
              });

              eventSource.close();
            }
          }
        };
      });

      return () => {
        if (eventSource) {
          console.log('Cleaning up stream instance resources...');
          eventSource.close();
        }
      };
    });
  }
}
