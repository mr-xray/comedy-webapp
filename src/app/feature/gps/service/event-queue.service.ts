import { Injectable } from '@angular/core';
import { AppEvent } from 'src/app/data_access/websocket/types';
import { Queue } from '../util/queue';

@Injectable({
  providedIn: 'root',
})
export class EventQueueService {
  public constructor() {
    this.queue = new Queue<AppEvent>();
  }

  private readonly queue: Queue<AppEvent>;

  public retrieveHead(): AppEvent | undefined {
    return this.queue.top();
  }

  public popHead(): AppEvent | undefined {
    return this.queue.pop();
  }

  public submitPoint(point: AppEvent): void {
    this.queue.push(point);
  }
}
