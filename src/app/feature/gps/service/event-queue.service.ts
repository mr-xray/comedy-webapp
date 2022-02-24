import { trigger } from '@angular/animations';
import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { Subject } from 'rxjs';
import {
  EventTriggerDto,
  TriggerEventBinding,
  TriggerType,
} from 'src/app/data_access/trigger-registration/triggers';
import { AppEvent } from 'src/app/data_access/websocket/util/types';
import { GpsTriggerPayload } from '../../../data_access/trigger-registration/trigger-type-controller';
import { Queue } from '../util/queue';
import { UpdatingPrioritySet } from '../util/updating-priority-set';

@Injectable({
  providedIn: 'root',
})
export class EventQueueService extends Subject<AppEvent> {
  private poppingLoops = 0;
  private interruptingMap: Map<number, boolean> = new Map<number, boolean>();
  public constructor(private readonly geolocation$: GeolocationService) {
    super();
    this.triggers = new Map<TriggerType, TriggerEventBinding[]>();
    this.events = new Map<number, AppEvent>();
    geolocation$.subscribe((position) => {
      for (let triggerBinding of this.triggers.get(TriggerType.GPS) as any) {
        if (
          triggerBinding &&
          !this.events.get(triggerBinding.eventId)?.finish
        ) {
          if (
            (triggerBinding as TriggerEventBinding).payload.trigger(position)
          ) {
            this.doUpdateCheck(triggerBinding);
          }
        }
      }
    });
    Object.entries(TriggerType).forEach((triggerType) =>
      this.triggers.set(triggerType[1], [])
    );
    geolocation$.subscribe((position) => {
      //console.log('sos');
    });
  }
  private events: Map<number, AppEvent>;
  /*public get getSequence(): AppEvent[] {
    return this.queue.storage;
  }*/

  private readonly updatingPrioritySet: UpdatingPrioritySet =
    new UpdatingPrioritySet();
  private triggers: Map<TriggerType, TriggerEventBinding[]> = new Map<
    TriggerType,
    TriggerEventBinding[]
  >();

  public submitEvent(event: AppEvent): Subject<AppEvent> {
    //console.log('Submission received: ', event);
    const triggers: EventTriggerDto[] = event.triggers;
    for (let trigger of triggers) {
      const triggerEventBinding: TriggerEventBinding = {
        eventId: event.id,
        ...trigger,
      };
      this.triggers.get(trigger.type)?.push(triggerEventBinding);
      this.events.set(event.id, event);
      //this.triggers.pushEvent(event);
    }
    return this;
  }

  public triggerManualTrigger(trigger: number): void {
    if (trigger) {
      let manuals: TriggerEventBinding[] | undefined = this.triggers.get(
        TriggerType.MANUAL
      );
      if (manuals) {
        for (let tr of manuals) {
          if (tr.id === trigger) {
            this.doUpdateCheck(tr);
          }
        }
      }
    }
    //this.doUpdateCheck(this.triggers.get(TriggerType.MANUAL));
  }

  private async reInitiateSetTriggerLoop() {
    // Work through the triggered Triggers until there are either:
    // * None left
    // * New triggers with higher priority so the current loop needs to be interrupted because
    // --> Method has been called another time to override the current event so this loop needs to stop
    let poppingLoop = ++this.poppingLoops;
    //console.log('New entry on interruption map: ', this.interruptingMap);
    for (let entry of this.interruptingMap.entries()) {
      this.interruptingMap.set(entry[0], true);
    }
    this.interruptingMap.set(poppingLoop, false);
    while (this.updatingPrioritySet.storage.length !== 0) {
      let endTime = this.updatingPrioritySet.activeTriggerDuration ?? 0;
      //console.log(this.updatingPrioritySet.storage.length);
      // If active trigger is not over yet, wait until it is
      if (new Date().valueOf() < endTime) {
        //console.log('Not ready yet');
        await new Promise((resolve) => {
          setTimeout(resolve, endTime - new Date().valueOf());
        });
      }

      // If you get here, the next trigger needs to be triggered
      // If the loop of this method call was interrupted, delete the loop and return
      // It can do this because if it was interrupted, there is already another call of reInitiateSetLoop
      // The executing instance of reInitiateSetLoop is always that which was triggered by the currently executing trigger
      // The currently executing trigger is the trigger with the highest priority of those, who have been triggered
      if (this.interruptingMap.get(poppingLoop)) {
        //console.log('I was interrupted');
        this.interruptingMap.delete(poppingLoop);
        return;
      }

      //Pop off the set
      let triggered = this.updatingPrioritySet.pop();
      //console.log(this.updatingPrioritySet.storage);
      if (triggered) {
        let event = this.events.get(triggered.eventId) ?? { finish: false };
        if (
          (triggered.type === TriggerType.GPS && !event.finish) ||
          triggered.type === TriggerType.MANUAL
        ) {
          event.finish = true;
          this.next(this.events.get(triggered.eventId));
        }
      }
    }
    this.interruptingMap.delete(poppingLoop);
  }

  private doUpdateCheck(trigger: TriggerEventBinding) {
    let top = this.updatingPrioritySet.push(trigger);
    if (top) {
      this.reInitiateSetTriggerLoop();
    }
  }

  public get unobscureGpsTriggers(): TriggerEventBinding[] {
    return (
      this.triggers
        .get(TriggerType.GPS)
        ?.filter((t) => !(t.payload as GpsTriggerPayload).obscure) ?? []
    );
  }
}
