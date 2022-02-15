import {
  ManualTriggerPayload,
  TriggerEventBinding,
  TriggerType,
} from 'src/app/data_access/websocket/util/triggers';
import { AppEvent } from 'src/app/data_access/websocket/util/types';
import { GpsTriggerPayload } from './gps-trigger';

export class UpdatingPrioritySet {
  public constructor() {}
  private _store: TriggerEventBinding[] = [];
  private _events: Map<number, AppEvent> = new Map<number, AppEvent>();
  private maxSequence: number = 0;
  public _activeTriggerDuration:
    | { startDate: Date; duration: number }
    | undefined = undefined;

  // Return value says wheter Trigger was inserted at the top, so the event would need to be interrupted
  public push(val: TriggerEventBinding): boolean {
    // If Trigger is GPS-Trigger, check:
    //    If it is a trigger in sequence, check wheter it follows the sequence
    //    If it is a trigger on its own, submit it to the updating priority set
    if (val.type === TriggerType.GPS) {
      if ((val.payload as GpsTriggerPayload).sequence <= this.maxSequence + 1) {
        this.maxSequence = Math.max(
          (val.payload as GpsTriggerPayload).sequence,
          this.maxSequence
        );
      } else {
        return false;
      }
    }
    // Check wheter Event of Incoming Trigger already exists
    // If it does, check wheter it has a higher priority and update the priority if given
    // If the priority stays the same, keep the old one because the new one would be inserted
    // at the latter end of the queue for the priority
    const trigger = this._store.findIndex((t) => t.eventId === val.eventId);
    if (trigger >= 0) {
      if (val.priority > this._store[trigger].priority) {
        this._store.splice(trigger, 1);
      } else {
        return false;
      }
    }

    if (val.priority) {
      // If event is new and trigger has a valid priority,
      // insert it at its spot the smaller end of the (sorted)"updating priority set" via Binary Search
      let index: number = this.findMaxBinaryIndex(val);
      this._store.splice(index, 0, val);
    }

    // If event
    if (this.top()?.id === val.id) {
      this._activeTriggerDuration = undefined;
      return true;
    }
    return false;
  }

  private findMaxBinaryIndex(val: TriggerEventBinding): number {
    //Binary Search with smaller end index decision
    let lo = -1;
    let middle;
    let hi = this._store.length - 1;
    while (hi !== lo) {
      middle = Math.ceil((hi + lo) / 2);
      if (this._store[middle].priority < val.priority) {
        lo = middle;
      } else if (this._store[middle].priority >= val.priority) {
        hi = middle - 1;
      }
    }
    return hi + 1;
  }

  public pop(): TriggerEventBinding | undefined {
    let triggerd: TriggerEventBinding | undefined;
    if (this._activeTriggerDuration !== undefined) {
      if (
        new Date(
          this._activeTriggerDuration.startDate.valueOf() +
            this._activeTriggerDuration.duration
        ).valueOf() <= new Date().valueOf()
      ) {
        triggerd = this._store.pop();
        this._activeTriggerDuration = {
          startDate: new Date(),
          duration: (triggerd?.payload as ManualTriggerPayload).minDuration,
        };
      } else {
        throw new Error('Active Event time has no yet ended');
      }
    }
    return triggerd;
  }

  public top(): TriggerEventBinding | undefined {
    return this._store[this._store.length - 1];
  }

  public get storage(): TriggerEventBinding[] {
    return this._store;
  }

  public get activeTriggerDuration():
    | { startDate: Date; duration: number }
    | undefined {
    return this._activeTriggerDuration;
  }

  public pushEvent(event: AppEvent): void {
    this._events.set(event.id, event);
  }
}
