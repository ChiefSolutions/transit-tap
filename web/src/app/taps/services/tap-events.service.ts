import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TapTableRow, TapResponse, TapRowWithStats } from '../types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TapEventsService {
  private readonly API_URL = `${environment.apiUrl}/taps`;

  getEvents(): Observable<TapRowWithStats> {
    return new Observable((observer) => {
      console.log('connecting to stream...');

      const eventSource = new EventSource(this.API_URL);

      eventSource.onopen = () => {
        console.log('Successfully connected to the stream!');
      };

      eventSource.onmessage = (message: MessageEvent<string>) => {
        const data: TapResponse = JSON.parse(message.data);
        const { tap, summary } = data;
        const { deviceName, event, eventId, status, timestamp } = tap;
        const row: TapTableRow = { deviceName, event, eventId, status, timestamp };

        observer.next({ tap: row, summary });
      };

      eventSource.addEventListener('close', () => {
        console.log('Closing stream...');
        eventSource.close();
        observer.complete();
        console.log('Stream closed and disconnected.');
      });

      eventSource.onerror = (error) => {
        if (eventSource.readyState === EventSource.CONNECTING) {
          // Auto-retry in progress, shut it down
          observer.error(error);
          observer.complete();
          eventSource.close();
          return;
        }

        // Suppress errors if the client or server already closed the connection cleanly
        if (eventSource.readyState !== EventSource.CLOSED) {
          console.log('An error occurred, closing stream connection...');
          observer.error(error);
          eventSource.close();
        }
      };

      return () => eventSource.close();
    });
  }
}
