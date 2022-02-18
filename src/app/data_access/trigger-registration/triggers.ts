export enum TriggerType {
  MANUAL = 'MANUAL',
  GPS = 'GPS',
}
export interface EventTriggerDto {
  id: number;
  payload: TriggerPayload;
  type: TriggerType;
  priority: number;
}

export interface TriggerPayload {
  trigger(triggeringObject: any): boolean;
}

export interface TriggerEventBinding extends EventTriggerDto {
  eventId: number;
}
