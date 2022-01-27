export enum TriggerTypes {
  RootCalled = 0,
  Gps,
}

export enum EventTypes {
  Video = 0,
  Image,
  MultipleChoice,
  Vibration,
}

export interface EventTriggerDto {
  type: TriggerTypes;
  payload: any;
}

export interface EventDto {
  triggers: EventTriggerDto[];
  ignoreOrder: boolean;
  event: {
    type: EventTypes;
    payload: any;
  };
}

export abstract class EventTrigger implements EventTriggerDto {
  public constructor(type: TriggerTypes, payload: any) {
    this.type = type;
    this.payload = payload;
  }
  readonly type: TriggerTypes;
  readonly payload: any;
  abstract trigger(triggeringObject: any): any;
}

export interface AppEvent {
  eventId: number;
  triggers: EventTrigger[];
  ignoreOrder: boolean;
  deliverable: boolean;
  timestamp?: Date;
  event: {
    type: EventTypes;
    payload: any;
  };
}
