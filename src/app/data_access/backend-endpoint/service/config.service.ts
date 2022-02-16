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
    this.requestConfig();
    this.subscribe((events) => {
      events.forEach((event) => eventQueue.submitEvent(event));
    });
  }

  public requestConfig() {
    let events = config;
    of(events.events)
      .pipe(
        map((response: any): AppEvent[] =>
          (response.events as EventDto[]).map<AppEvent>((eventDto) => ({
            finish: false,
            ...eventDto,
          }))
        )
      )
      .subscribe(this);

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
}
