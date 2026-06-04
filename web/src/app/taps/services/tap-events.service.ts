import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TapTableRow, TapResponse, TapRowWithStats } from '../models';
import { TapEventLabelMap } from '../../constants';
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

      eventSource.onmessage = (event: MessageEvent<string>) => {
        const data: TapResponse = JSON.parse(event.data);
        const { tap, summary } = data;

        const row: TapTableRow = {
          eventId: tap.eventId,
          deviceName: tap.deviceName,
          timestamp: tap.timestamp,
          event: tap.event,
          status: TapEventLabelMap[tap.status],
        };

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
          eventSource.close();
          observer.complete();
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
