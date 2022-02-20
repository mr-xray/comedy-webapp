import { state } from '@angular/animations';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ImageEventPayload } from 'src/app/data_access/websocket/util/events';

@Component({
  selector: 'app-image-event',
  templateUrl: './image-event.component.html',
  styleUrls: ['./image-event.component.scss'],
})
export class ImageEventComponent implements OnInit {
  @Input() public payload: ImageEventPayload = { url: '' };
  constructor() {}

  ngOnInit(): void {}

  public imageStyle() {
    return {
      width: this.payload.width,
      height: this.payload.height,
    };
  }

  @HostBinding('style.border-radius')
  get borderRadius() {
    return this.payload.borderRadius;
  }

  @HostBinding('style.width')
  get width() {
    return this.payload.width;
  }

  @HostBinding('style.height')
  get height() {
    return this.payload.height;
  }
}
