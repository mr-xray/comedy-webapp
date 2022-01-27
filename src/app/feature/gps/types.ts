class Queue<T> {
  public constructor() {}

  _store: T[] = [];
  push(val: T) {
    this._store.push(val);
  }

  pop(): T | undefined {
    return this._store.shift();
  }
}

enum TriggerTypes {
  ROOT_CALLED = 0,
  GPS,
}

enum EventTypes {
  VIDEO = 0,
  IMAGE,
  MULTIPLE_CHOICE,
  VIBRATION,
}

interface EventTrigger {
  type: TriggerTypes;
  payload: any;
}

interface GpsPayload {
  type: TriggerTypes;
  lat: number;
  radiusInMeter: number;
  lon: number;
}

interface EventDto {
  triggers: EventTrigger[];
  ignoreOrder: boolean;
  event: {
    type: EventTypes;
  };
}
