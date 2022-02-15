import {
  TriggerPayload,
  TriggerType,
} from 'src/app/data_access/websocket/util/triggers';

export class GpsTriggerPayload implements TriggerPayload {
  constructor(
    obscure: boolean,
    sequence: number,
    markerIcon: string,
    radius: number,
    direction: CompassDirection,
    description: string,
    coordinates: any
  ) {
    this.obscure = obscure;
    this.sequence = sequence;
    this.markerIcon = markerIcon;
    this.radius = radius;
    this.direction = direction;
    this.description = description;
    this.coordinates = coordinates;
  }

  obscure: boolean;
  sequence: number;
  markerIcon: string;
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

export enum CompassDirection {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
}
