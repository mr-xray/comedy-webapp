import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { Observable, Subscriber } from 'rxjs';
import { AppEvent, TriggerTypes } from 'src/app/data_access/websocket/types';
import { GpsEventMetric } from '../util/types';

@Injectable({
  providedIn: 'root',
})
export class ExtraEventService extends Observable<AppEvent> {
  public constructor(private readonly geolocation$: GeolocationService) {
    super((observer: Subscriber<AppEvent>) => {
      this.geolocation$.subscribe((position: GeolocationPosition) => {
        const event: AppEvent | undefined = this.visitEvents(position);
        if (event) {
          observer.next(event);
        }
      });
    });
    this.events = [];
  }

  private events: AppEvent[];

  public submitPoint(point: AppEvent): void {
    if (point.ignoreOrder) {
      this.events.push(point);
    }
  }

  private visitEvents(position: GeolocationPosition): AppEvent | undefined {
    let candidate: AppEvent | undefined = undefined;
    let candidateMetric: number = Infinity;
    this.events.forEach((x) =>
      x.triggers.forEach((t) => {
        if (t.type === TriggerTypes.Gps) {
          let result: GpsEventMetric = t.trigger(position);
          if (result.inRange) {
            this.finishEvent(x);
            if (result.distanceInMeter < candidateMetric) {
              candidateMetric = result.distanceInMeter;
              candidate = x;
            }
          }
        }
      })
    );
    return candidate;
  }

  private finishEvent(event: AppEvent): void {
    this.events = this.events.filter((ev) => ev.eventId !== event.eventId);
    event.deliverable = false;
    event.timestamp = new Date();
  }
}
