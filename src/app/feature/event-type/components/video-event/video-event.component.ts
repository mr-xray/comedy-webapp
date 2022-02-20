import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { VideoEventPayload } from 'src/app/data_access/websocket/util/events';

@Component({
  selector: 'app-video-event',
  templateUrl: './video-event.component.html',
  styleUrls: ['./video-event.component.scss'],
})
export class VideoEventComponent implements OnInit {
  @Input() public payload: VideoEventPayload = {
    url: '',
    width: 0,
    height: 0,
    length: 0,
  };
  constructor() {}

  ngOnInit(): void {}

  @ViewChild('videoplayer') private videoplayer: any;
  toggleVideo() {
    this.videoplayer.nativeElement.play();
    // this.videoplayer.nativeElement.pause();}
  }
}
