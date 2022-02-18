import { EventIdentifier } from './events';
import { EventTriggerDto } from '../../trigger-registration/triggers';

export interface EventDto {
  id: number;
  triggers: EventTriggerDto[];
  name: string;
  description: string;
  payload: any;
  type: EventIdentifier;
}
export interface AppEvent extends EventDto {
  finish: boolean;
}
