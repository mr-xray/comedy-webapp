export namespace TriggerTypeController {
  export type Constructor<T> = {
    new (...args: any[]): T;
    readonly prototype: T;
  };
  const mapping: Map<TriggerType, Constructor<TriggerPayload>> = new Map<
    TriggerType,
    Constructor<TriggerPayload>
  >();
  export function GetImplementations(): Map<
    TriggerType,
    Constructor<TriggerPayload>
  > {
    return mapping;
  }
  export function register(mapTo: TriggerType) {
    return (ctor: Constructor<TriggerPayload>) => {
      mapping.set(mapTo, ctor);
    };
  }
}

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

@TriggerTypeController.register(TriggerType.MANUAL)
export class ManualTriggerPayload implements TriggerPayload {
  constructor(minDuration: number) {
    this.minDuration = minDuration;
  }

  minDuration: number;
  trigger(triggeringObject: any) {
    return true;
  }
}

export interface TriggerEventBinding extends EventTriggerDto {
  eventId: number;
}
