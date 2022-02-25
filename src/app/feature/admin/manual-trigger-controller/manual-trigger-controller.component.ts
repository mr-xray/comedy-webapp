import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/data_access/backend-endpoint/service/config.service';
import { TriggerType } from 'src/app/data_access/trigger-registration/triggers';
import { WebsocketService } from 'src/app/data_access/websocket/service/websocket.service';
import { AppEvent } from 'src/app/data_access/websocket/util/types';

@Component({
  selector: 'app-manual-trigger-controller',
  templateUrl: './manual-trigger-controller.component.html',
  styleUrls: ['./manual-trigger-controller.component.scss'],
})
export class ManualTriggerControllerComponent implements OnInit {
  private triggers;
  public displayTriggers: { title: string; type: string; id: number }[] = [];
  constructor(
    private configService: ConfigService,
    private socketService: WebsocketService
  ) {
    this.triggers = configService.getValue();
    this.transformTriggers(this.triggers);
    configService.subscribe((updated) => {
      this.triggers = updated;
      this.transformTriggers(this.triggers);
    });
  }

  ngOnInit(): void {}

  private transformTriggers(events: AppEvent[]) {
    this.displayTriggers = [];
    events.forEach((event) => {
      event.triggers = event.triggers.filter(
        (trigger) => trigger.type === TriggerType.MANUAL
      );
    });
    events.forEach((event) => {
      event.triggers.forEach((trigger) => {
        this.displayTriggers.push({
          title: event.name,
          type: event.type,
          id: trigger.id,
        });
      });
    });
  }

  public triggerManual(id: number) {
    console.log('triggering', id);
    this.socketService.dispatchManualTrigger(id);
  }
}
