import {
  Component,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { VideoEventPayload } from 'src/app/data_access/websocket/util/events';

@Component({
  selector: 'app-video-event',
  templateUrl: './video-event.component.html',
  styleUrls: ['./video-event.component.scss'],
})
export class VideoEventComponent implements OnInit {
  @Input() public payload: VideoEventPayload = {
    url: '',
  };
  constructor() {}

  @ViewChild('videoplayer') private videoplayer: any;

  ngOnInit(): void {
    let ttl = this.payload.length;
    if (ttl) {
      setTimeout(() => {
        this.videoplayer.nativeElement.remove();
      }, ttl);
    }
  }

  /*@ViewChild('videoplayer') private videoplayer: any;
  toggleVideo() {
    this.videoplayer.nativeElement.play();
    // this.videoplayer.nativeElement.pause();}
  }*/

  public setStyle() {
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
