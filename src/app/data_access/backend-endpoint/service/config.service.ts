import { trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventQueueService } from 'src/app/feature/gps/service/event-queue.service';
import {
  GpsTriggerPayload,
  CompassDirection,
} from 'src/app/feature/gps/util/gps-trigger';
import { JwtProviderService } from '../../authentication/service/jwt-provider.service';
import { EventIdentifier } from '../../websocket/util/events';
import { SocketCommunicationMessage } from '../../websocket/util/socket-communication-message';
import {
  TriggerType,
  ManualTriggerPayload,
  TriggerPayload,
  TriggerTypeController,
} from '../../websocket/util/triggers';
import { AppEvent, EventDto } from '../../websocket/util/types';
import { config } from './dummyData';

@Injectable({
  providedIn: 'root',
})
export class ConfigService extends BehaviorSubject<AppEvent[]> {
  private static readonly configUrl: string = 'jakob-galaxy.at/config';
  constructor(
    private readonly http: HttpClient,
    private readonly eventQueue: EventQueueService,
    private readonly jwt: JwtProviderService
  ) {
    super([]);
    jwt.auth();
    this.subscribe((events) => {
      console.log('SUBJECT RECEIVED S', events);
      events.forEach((event) => {
        this.fillEvent(event);
        eventQueue.submitEvent(event);
      });
    });
    this.requestConfig();
  }

  public requestConfig() {
    console.log('requesting config from', config.events);
    let events = config;
    of(events.events)
      .pipe(
        map((response: any): AppEvent[] => {
          console.log('Response received', response);
          return (response.events as EventDto[]).map<AppEvent>((eventDto) => ({
            finish: false,
            ...eventDto,
          }));
        })
      )
      .subscribe((res) => {
        console.log('nexting ', res);
        this.next(res);
      });

    //  !!! Actual request down below !!!

    /*this.http
      .get(ConfigService.configUrl)
      .pipe(
        map((response: any): AppEvent[] =>
          (response.events as EventDto[]).map<AppEvent>((eventDto) => ({
            finish: false,
            ...eventDto,
          }))
        )
      )
      .subscribe(this);*/
  }

  private fillEvent(event: AppEvent) {
    console.log('Filling event', event);
    event.triggers.forEach((trigger) => {
      let constructor = TriggerTypeController.GetImplementations().get(
        trigger.type
      );
      if (constructor) {
        let parameters = trigger.payload as any;
        trigger.payload = new constructor(...parameters);
      }
    });
    //-----------------------------------------------------
    event.triggers.forEach((tr) => {
      console.log(typeof trigger);
    });
  }
}
