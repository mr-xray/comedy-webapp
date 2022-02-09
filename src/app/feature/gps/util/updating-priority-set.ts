import {
  TriggerEventBinding,
  TriggerType,
} from 'src/app/data_access/websocket/util/triggers';
import { GpsTriggerPayload } from './gps-trigger';

export class UpdatingPrioritySet {
  public constructor() {}
  private _store: TriggerEventBinding[] = [];
  private maxSequence: number = 0;

  public push(val: TriggerEventBinding): void {
    // If Trigger is GPS-Trigger, check:
    //    If it is a trigger in sequence, check wheter it follows the sequence
    //    If it is a trigger on its own, submit it to the updating priority set
    if (val.payload.type === TriggerType.GPS) {
      if ((val.payload as GpsTriggerPayload).sequence <= this.maxSequence + 1) {
        this.maxSequence = Math.max(
          (val.payload as GpsTriggerPayload).sequence,
          this.maxSequence
        );
      } else {
        return;
      }
    }
    // Check wheter Event of Incoming Trigger already exists
    // If it does, check wheter it has a higher priority and update the priority if given
    // If the priority stays the same, keep the old one because the new one would be inserted
    // at the latter end of the queue for the priority
    const trigger = this._store.findIndex((t) => t.eventId === val.eventId);
    if (trigger >= 0) {
      if (val.payload.priority > this._store[trigger].payload.priority) {
        this._store.splice(trigger, 1);
      } else {
        return;
      }
    }

    if (val.payload.priority) {
      // If event is new and trigger has a valid priority,
      // insert it at its spot the smaller end of the (sorted)"updating priority set" via Binary Search
      let index: number = this.findMaxBinaryIndex(val);
      this._store.splice(index, 0, val);
    }
  }

  private findMaxBinaryIndex(val: TriggerEventBinding): number {
    //Binary Search with smaller end index decision
    let lo = -1;
    let middle;
    let hi = this._store.length - 1;
    while (hi !== lo) {
      middle = Math.ceil((hi + lo) / 2);
      if (this._store[middle].payload.priority < val.payload.priority) {
        lo = middle;
      } else if (this._store[middle].payload.priority >= val.payload.priority) {
        hi = middle - 1;
      }
    }
    return hi + 1;
  }

  public pop(): TriggerEventBinding | undefined {
    return this._store.pop();
  }

  public top(): TriggerEventBinding | undefined {
    return this._store[this._store.length - 1];
  }

  public get storage(): TriggerEventBinding[] {
    return this._store;
  }
}
