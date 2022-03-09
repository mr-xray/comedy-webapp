import { Component, Input, OnInit } from '@angular/core';
import { AugmentedRealityEventPayload } from 'src/app/data_access/websocket/util/events';

@Component({
  selector: 'app-augmented-reality-event',
  templateUrl: './augmented-reality-event.component.html',
  styleUrls: ['./augmented-reality-event.component.scss'],
})
export class AugmentedRealityEventComponent implements OnInit {
  @Input() public payload: AugmentedRealityEventPayload = {
    url: '',
    width: 0,
    height: 0,
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    scale: {
      x: 0,
      y: 0,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  };
  constructor() {}

  ngOnInit(): void {}
}
