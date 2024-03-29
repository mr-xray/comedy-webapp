import { TriggerType, TriggerPayload } from './triggers';
export namespace TriggerTypeController {
  export type Constructor<T> = {
    new (...args: any[]): T;
    readonly prototype: T;
  };
  const mapping: Map<TriggerType, Constructor<TriggerPayload>> = new Map<
    TriggerType,
    Constructor<TriggerPayload> //Constructor<TriggerPayload>
  >();
  export function getImplementations(): Map<
    TriggerType,
    Constructor<TriggerPayload> //Constructor<TriggerPayload>
  > {
    return mapping;
  }
  export function register(mapTo: TriggerType) {
    return (ctor: Constructor<TriggerPayload>) => {
      //console.log('registering ', ctor);
      mapping.set(mapTo, ctor);
    };
  }
}

export enum CompassDirection {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
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

@TriggerTypeController.register(TriggerType.GPS)
export class GpsTriggerPayload implements TriggerPayload {
  constructor(
    obscure: boolean,
    sequence: number,
    markerIcon: string,
    passedMarkerIcon: string,
    coordinates: any,
    radius: number,
    direction: CompassDirection,
    description: string
  ) {
    this.obscure = obscure;
    this.sequence = sequence;
    this.markerIcon = markerIcon;
    this.passedMarkerIcon = passedMarkerIcon;
    this.radius = radius;
    this.direction = direction;
    this.description = description;
    this.coordinates = coordinates;
  }

  obscure: boolean;
  sequence: number;
  markerIcon: string;
  passedMarkerIcon: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  direction: CompassDirection;
  description: string;
  trigger(position: GeolocationPosition): boolean {
    const distance: number = this.calcCrow(
      position.coords.latitude,
      position.coords.longitude,
      this.coordinates.latitude,
      this.coordinates.longitude
    );
    return distance <= this.radius;
  }
  private calcCrow(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    var R = 6371; // km
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
}
