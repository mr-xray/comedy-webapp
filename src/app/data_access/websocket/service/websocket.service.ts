import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { ReplaySubject } from 'rxjs';
import { EventQueueService } from 'src/app/feature/gps/service/event-queue.service';
import { JwtProviderService } from '../../authentication/service/jwt-provider.service';
import { ConfigService } from '../../backend-endpoint/service/config.service';
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
  public userLocations: ReplaySubject<{
    username: string;
    role: string;
    location: { longitude: number; latitude: number };
  }> = new ReplaySubject(1);

  private authorizationSet: boolean = false;
  private jwtExpiryBuffer: {
    channel: SocketCommunicationMessage;
    payload: any;
  }[] = [];

  constructor(
    private webSocket: Socket,
    private eventQueue: EventQueueService,
    private geolocation$: GeolocationService,
    private jwt: JwtProviderService
  ) {
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
        eventQueue.triggerManualTrigger(response as number);
      });

    webSocket
      .fromEvent(SocketCommunicationMessage.TokenExpired)
      .subscribe((response) => {
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
    this.geolocation$.subscribe((posi) =>
      this.dispatchMessage(SocketCommunicationMessage.Location, {
        latitude: posi.coords.latitude,
        longitude: posi.coords.longitude,
      })
    );
  }

  public dispatchManualTrigger(trigger: EventTriggerDto) {
    this.dispatchMessage(SocketCommunicationMessage.ManualTrigger, trigger.id);
  }

  private dispatchMessage(channel: SocketCommunicationMessage, payload: any) {
    if (!this.authorizationSet) {
      this.jwtExpiryBuffer.push({ channel, payload });
      return;
    }

    //console.log(this.jwt.getEarlyExpiryDate(), new Date());
    if (
      !this.jwt.getEarlyExpiryDate() ||
      (this.jwt.getEarlyExpiryDate() as Date) < new Date()
    ) {
      console.log('Token is about to expire');
      this.authorizationSet = false;
      this.jwt
        .renewToken()
        .subscribe((res) => this.dispatchMessage(channel, payload));
      return;
    }
    while (this.jwtExpiryBuffer.length !== 0) {
      let emitted = this.jwtExpiryBuffer.shift();
      if (emitted) {
        this.webSocket.emit(emitted.channel, emitted.payload);
      }
    }
    this.webSocket.emit(channel, payload);
  }
}