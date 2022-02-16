import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventQueueService } from 'src/app/feature/gps/service/event-queue.service';
import {
  GpsTriggerPayload,
  CompassDirection,
} from 'src/app/feature/gps/util/gps-trigger';
import { JwtProviderService } from '../authentication/service/jwt-provider.service';
import { EventIdentifier } from './util/events';
import { SocketCommunicationMessage } from './util/socket-communication-message';
import { TriggerType, ManualTriggerPayload } from './util/triggers';
import { AppEvent, EventDto } from './util/types';

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
    this.http
      .get(ConfigService.configUrl)
      .pipe(
        map((response: any): AppEvent[] =>
          (response.events as EventDto[]).map<AppEvent>((eventDto) => ({
            finish: false,
            ...eventDto,
          }))
        )
      )
      .subscribe(this);
  }
}
