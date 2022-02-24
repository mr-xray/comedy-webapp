import { trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventQueueService } from 'src/app/feature/gps/service/event-queue.service';
import { environment } from 'src/environments/environment';
import { JwtProviderService } from '../../authentication/service/jwt-provider.service';
import {
  GpsTriggerPayload,
  ManualTriggerPayload,
  TriggerTypeController,
} from '../../trigger-registration/trigger-type-controller';
import { TriggerType } from '../../trigger-registration/triggers';
import { AppEvent, EventDto } from '../../websocket/util/types';
import { config } from './dummyData';

@Injectable({
  providedIn: 'root',
})
export class ConfigService extends BehaviorSubject<AppEvent[]> {
  private static readonly configUrl: string = `${environment.apiUrl}/events`;
  constructor(
    private readonly http: HttpClient,
    private readonly eventQueue: EventQueueService,
    private readonly jwt: JwtProviderService
  ) {
    super([]);
    jwt.auth();
    this.subscribe((events) => {
      //console.log('SUBJECT RECEIVED S', events);
      events.forEach((event) => {
        this.fillEvent(event);
        eventQueue.submitEvent(event);
      });
    });
    this.requestConfig();
  }

  public requestConfig() {
    //console.log('requesting config from', config.events);
    let events = config;
    of(events.events)
      .pipe(
        map((response: any): AppEvent[] =>
          (response as EventDto[]).map<AppEvent>((eventDto) => ({
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

  private fillEvent(event: AppEvent) {
    //console.log('Filling event', event);
    //console.log('constructors: ', TriggerTypeController.getImplementations());
    event.triggers.forEach((trigger) => {
      /*console.log('concerning tr ', trigger);
      let constructor = TriggerTypeController.getImplementations().get(
        trigger.type
      );
      console.log(constructor);
      if (constructor) {
        let parameters = trigger.payload as any;
        trigger.payload = constructor.call(this, ...parameters);
      }
    });
    console.log('Filling event', event);
    //-----------------------------------------------------
    event.triggers.forEach((tr) => {
      console.log(typeof trigger);
    });*/
      let params = trigger.payload as any;
      switch (trigger.type) {
        case TriggerType.GPS:
          trigger.payload = new GpsTriggerPayload(
            params.obscure,
            params.sequence,
            params.markerIcon,
            params.passedMarkerIcon,
            params.coordinates,
            params.radius,
            params.direction,
            params.description
          );
          break;
        case TriggerType.MANUAL:
          trigger.payload = new ManualTriggerPayload(params.minDuration);
      }
    });
  }
}
