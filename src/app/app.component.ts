import { Component } from '@angular/core';
import { SimpleOuterSubscriber } from 'rxjs/internal/innerSubscribe';
import { ConfigService } from './data_access/backend-endpoint/service/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public constructor(private readonly configReader: ConfigService) {}
  title = 'comedy-web';
}
