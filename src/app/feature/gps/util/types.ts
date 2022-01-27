import {
  EventTrigger,
  TriggerTypes,
} from 'src/app/data_access/websocket/types';

export interface GpsPayload {
  lat: number;
  radiusInMeter: number;
  lon: number;
}

export interface GpsEventMetric {
  inRange: boolean;
  distanceInMeter: number;
}

export class GpsTrigger extends EventTrigger {
  public constructor(payload: GpsPayload) {
    super(TriggerTypes.Gps, payload);
    this.payload = payload;
  }
  trigger(position: GeolocationPosition): GpsEventMetric {
    const payload: GpsPayload = this.payload;
    const distance: number = this.calcCrow(
      position.coords.latitude,
      position.coords.longitude,
      payload.lat,
      payload.lon
    );
    return {
      distanceInMeter: distance,
      inRange: distance <= payload.radiusInMeter,
    };
  }
  override readonly payload: GpsPayload;

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
