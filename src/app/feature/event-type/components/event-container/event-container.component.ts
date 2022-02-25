import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EventIdentifier } from 'src/app/data_access/websocket/util/events';
import { AppEvent } from 'src/app/data_access/websocket/util/types';
import { EventQueueService } from 'src/app/feature/gps/service/event-queue.service';

@Component({
  selector: 'app-event-container',
  templateUrl: './event-container.component.html',
  styleUrls: ['./event-container.component.scss'],
})
export class EventContainerComponent implements OnInit {
  public EventIdentifier: typeof EventIdentifier = EventIdentifier;
  public eventType: EventIdentifier | undefined;
  public eventPayload: any;
  public eventId: any;
  @Output() eventDescription = new EventEmitter<string>();
  @Output() eventTitle = new EventEmitter<string>();

  constructor(private readonly eventQueue: EventQueueService) {}

  ngOnInit(): void {
    this.eventQueue.subscribe((event) => {
      console.log(event);
      this.eventType = event.type;
      this.eventId = event.id;
      this.eventPayload = event.payload;
      this.eventDescription.emit(event.description);
      this.eventTitle.emit(event.name);
    });
  }
}
