import { trigger } from '@angular/animations';
import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { Observable } from 'rxjs';
import {
  EventTriggerDto,
  TriggerEventBinding,
  TriggerType,
} from 'src/app/data_access/websocket/util/triggers';
import { AppEvent } from 'src/app/data_access/websocket/util/types';
import { GpsTriggerPayload } from '../util/gps-trigger';
import { Queue } from '../util/queue';
import { UpdatingPrioritySet } from '../util/updating-priority-set';

@Injectable({
  providedIn: 'root',
})
export class EventQueueService extends Observable<AppEvent> {
  public constructor(private readonly geolocation$: GeolocationService) {
    super();
    Object.entries(TriggerType).forEach((triggerType) =>
      this.triggers.set(triggerType[1], [])
    );
    geolocation$.subscribe((position) => {
      console.log('sos');
    });
  }

  /*public get getSequence(): AppEvent[] {
    return this.queue.storage;
  }*/

  private readonly updatingPrioritySet: UpdatingPrioritySet =
    new UpdatingPrioritySet();
  private triggers: Map<TriggerType, TriggerEventBinding[]> = new Map<
    TriggerType,
    TriggerEventBinding[]
  >();

  public submitEvent(event: AppEvent): void {
    const triggers: EventTriggerDto[] = event.triggers;
    for (let trigger of triggers) {
      const triggerEventBinding: TriggerEventBinding = {
        eventId: event.id,
        ...trigger,
      };
      this.triggers.get(trigger.payload.type)?.push(triggerEventBinding);
    }
  }
}
