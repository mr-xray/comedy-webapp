import { Component } from '@angular/core';
import { SimpleOuterSubscriber } from 'rxjs/internal/innerSubscribe';
import { ConfigService } from './data_access/backend-endpoint/service/config.service';
import { WebsocketService } from './data_access/websocket/service/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public constructor(
    private readonly configReader: ConfigService,
    private readonly socket: WebsocketService
  ) {}
  title = 'comedy-web';
}
