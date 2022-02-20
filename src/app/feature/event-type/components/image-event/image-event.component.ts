import { Component, Input, OnInit } from '@angular/core';
import { ImageEventPayload } from 'src/app/data_access/websocket/util/events';

@Component({
  selector: 'app-image-event',
  templateUrl: './image-event.component.html',
  styleUrls: ['./image-event.component.scss'],
})
export class ImageEventComponent implements OnInit {
  @Input() public payload: ImageEventPayload = { url: '', width: 0, height: 0 };
  constructor() {}

  ngOnInit(): void {}
}
