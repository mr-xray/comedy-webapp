import { EventIdentifier } from './events';
import { EventTriggerDto, TriggerPayload, TriggerType } from './triggers';

export interface EventDto {
  id: number;
  triggers: EventTriggerDto[];
  name: string;
  description: string;
  payload: EventPayload;
}
export interface AppEvent extends EventDto {
  finish: boolean;
}

export interface EventPayload {
  type: EventIdentifier;
}
