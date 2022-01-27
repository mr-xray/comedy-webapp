import { Component, OnInit } from '@angular/core';
import {
  AppEvent,
  EventTypes,
  TriggerTypes,
} from 'src/app/data_access/websocket/types';
import { ExtraEventService } from '../../service/extra-event.service';
import { GpsTrigger } from '../../util/types';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(private extraEvents: ExtraEventService) {
    const event: AppEvent = {
      eventId: 1,
      triggers: [
        new GpsTrigger({
          lat: 1,
          lon: 1,
          radiusInMeter: 5,
        }),
      ],
      ignoreOrder: true,
      deliverable: true,
      event: {
        type: EventTypes.Image,
        payload: {
          size: {
            width: 100,
            height: 100,
          },
          url: 'path/to/image.png',
        },
      },
    };
    event.deliverable = true;
    extraEvents.submitPoint(event);
    extraEvents.subscribe((x) => {
      x;
    });
  }

  ngOnInit(): void {}
}
