import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventQueueService {
  private static instance: EventQueueService;
  private constructor() {
    this.queue = new Queue<GpsPayload>();
  }

  private queue: Queue<GpsPayload>;

  public static getInstance(): EventQueueService {
    if (!EventQueueService.instance) {
      EventQueueService.instance = new EventQueueService();
    }
    return EventQueueService.instance;
  }
}
