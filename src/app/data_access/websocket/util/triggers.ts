export enum TriggerType {
  MANUAL = 'MANUAL',
  GPS = 'GPS',
}

export interface EventTriggerDto {
  id: number;
  payload: TriggerPayload;
}

export interface TriggerPayload {
  type: TriggerType;
  priority: number;
  trigger(triggeringObject: any): boolean;
}

export class ManualTriggerPayload implements TriggerPayload {
  constructor(minDuration: number, priority: number) {
    this.minDuration = minDuration;
    this.type = TriggerType.MANUAL;
    this.priority = priority;
  }
  type: TriggerType;
  priority: number;

  minDuration: number;
  trigger(triggeringObject: any) {
    return true;
  }
}

export interface TriggerEventBinding extends EventTriggerDto {
  eventId: number;
}
