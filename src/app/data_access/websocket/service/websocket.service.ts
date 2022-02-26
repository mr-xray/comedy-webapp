import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { ReplaySubject, Subject } from 'rxjs';
import { EventQueueService } from 'src/app/feature/gps/service/event-queue.service';
import { JwtProviderService } from '../../authentication/service/jwt-provider.service';
import { ConfigService } from '../../backend-endpoint/service/config.service';
import { QuestionService } from '../../backend-endpoint/service/question.service';
import { QuestionResultDto } from '../../backend-endpoint/types';
import { EventTriggerDto } from '../../trigger-registration/triggers';
import { SocketCommunicationMessage } from '../util/socket-communication-message';
import { EventDto } from '../util/types';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public static readonly SOCKET_CONFIG: SocketIoConfig = {
    url: 'https://jakob-galaxy.at:3000',
    options: {},
  };
  public userLocations: Subject<{
    username: string;
    role: string;
    location: { longitude: number; latitude: number };
  }> = new Subject();

  private authorizationSet: boolean = false;
  private jwtExpiryBuffer: {
    channel: SocketCommunicationMessage;
    payload: any;
  }[] = [];

  constructor(
    private webSocket: Socket,
    private eventQueue: EventQueueService,
    private geolocation$: GeolocationService,
    private jwt: JwtProviderService,
    private questions: QuestionService
  ) {
    if (sessionStorage.getItem('jwt')) {
      this.authorizationSet = true;
    }
    this.jwt.authProcess.subscribe((res) => {
      if (res) {
        let jwt = sessionStorage.getItem('jwt');
        webSocket.ioSocket.io.opts.query = {
          Authorization: jwt,
        };
      }
      this.authorizationSet = true;
      let latest = this.jwtExpiryBuffer.shift();
      if (latest) {
        this.dispatchMessage(latest?.channel, latest?.payload);
      }
    });

    // ---
    /*setInterval(() => {
      this.dispatchMessage(SocketCommunicationMessage.Location, {
        latitude: 45.5,
        longitude: 16.6,
      });
    }, 1000);*/
    // ---
    webSocket
      .fromEvent(SocketCommunicationMessage.ManualTrigger)
      .subscribe((response) => {
        console.log('[WebsocketService] Received incoming manual trigger');
        eventQueue.triggerManualTrigger(response as { id: number });
      });

    webSocket
      .fromEvent(SocketCommunicationMessage.TokenExpired)
      .subscribe((response) => {
        console.log('[WebsocketService] Unauthorized received');
        this.authorizationSet = false;
        jwt.renewToken();
      });

    webSocket
      .fromEvent(SocketCommunicationMessage.Location)
      .subscribe((response) =>
        this.userLocations.next(
          response as {
            username: string;
            role: string;
            location: { longitude: number; latitude: number };
          }
        )
      );

    //------------------
    // Test
    /*let inc = 0;
    let inc2 = 0;
    setInterval(() => {
      this.userLocations.next({
        username: 'test',
        role: 'hs',
        location: {
          longitude: 15.539918,
          latitude: 46.800877 + inc / 10000,
        },
      });
      inc++;
    }, 2000);
    setInterval(() => {
      this.userLocations.next({
        username: 'test2',
        role: 'hs',
        location: {
          longitude: 15.539918 + inc2 / 10000,
          latitude: 46.801077,
        },
      });
      inc2++;
    }, 1500);*/
    //------------------
    this.geolocation$.subscribe((posi) =>
      this.dispatchMessage(SocketCommunicationMessage.Location, {
        latitude: posi.coords.latitude,
        longitude: posi.coords.longitude,
      })
    );

    webSocket
      .fromEvent(SocketCommunicationMessage.Question)
      .subscribe((response) =>
        this.questions.handInQuestion(response as QuestionResultDto)
      );
  }

  public dispatchManualTrigger(trigger: number) {
    this.dispatchMessage(SocketCommunicationMessage.ManualTrigger, {
      id: trigger,
    });
  }

  public initLocationStream() {
    console.log('[WebsocketService] Requesting all locations');
    this.dispatchMessage(SocketCommunicationMessage.Location, {
      command: 'GETALL',
    });
  }

  private dispatchMessage(channel: SocketCommunicationMessage, payload: any) {
    //console.log('[WebsocketService] Attempting to send on ' + channel);
    if (!this.authorizationSet) {
      console.log('[WebsocketService] Unauthorized, buffering');
      this.jwtExpiryBuffer.push({ channel, payload });
      return;
    }

    //console.log(this.jwt.getEarlyExpiryDate(), new Date());
    if (
      !this.jwt.getEarlyExpiryDate() ||
      (this.jwt.getEarlyExpiryDate() as Date) < new Date()
    ) {
      console.log('[WebsocketService] Token is about to expire');
      this.authorizationSet = false;
      this.jwt.renewToken().subscribe((res) => {
        this.authorizationSet = true;
        this.dispatchMessage(channel, payload);
      });
      return;
    }
    let jwt = sessionStorage.getItem('jwt');
    while (this.jwtExpiryBuffer.length !== 0) {
      console.log('[WebsocketService] Working off buffered');
      let emitted = this.jwtExpiryBuffer.shift();
      if (emitted) {
        this.webSocket.emit(emitted.channel, {
          accessToken: jwt,
          payload: emitted.payload,
        });
      }
    }
    //console.log('[WebsocketService] Emmitting on ', channel);
    this.webSocket.emit(channel, {
      accessToken: jwt,
      payload: payload,
    });
  }
}
