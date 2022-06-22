import { Component, HostListener, OnInit } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { EventIdentifier } from 'src/app/data_access/websocket/util/events';
import {
  EventTriggerDto,
  TriggerEventBinding,
  TriggerType,
} from 'src/app/data_access/trigger-registration/triggers';
import { AppEvent } from 'src/app/data_access/websocket/util/types';
import { EventQueueService } from '../../service/event-queue.service';
import {
  ManualTriggerPayload,
  GpsTriggerPayload,
} from '../../../../data_access/trigger-registration/trigger-type-controller';
import { environment } from 'src/environments/environment';

export declare var ol: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(
    private eventQueue: EventQueueService,
    private geolocation$: GeolocationService
  ) {
    this.markerMap = new Map<string, any>();
    this.eventQueue = eventQueue;
    this.eventQueue.subscribe((ev) => {
      console.log('[MapComponent] New Event to draw');
      ev.triggers.forEach((t) => {
        if (t.type === TriggerType.GPS) {
        }
      });
    });
  }

  private map: any;
  private mapView: any;
  private markerMap: Map<string, any> = new Map();

  reloadMap() {
    console.log('[MapComponent] Clearing map');
    Array.from(this.markerMap.values()).map((m) => null);
    this.markerMap = new Map();
    //this.createMap();
  }

  ngOnInit() {
    this.createMap();
    this.eventQueue.gpsSubmission.subscribe((tr) => {
      //console.log('[MapComponent] New submission');
      this.createMarkerForGps(
        (tr.payload as GpsTriggerPayload).coordinates.longitude,
        (tr.payload as GpsTriggerPayload).coordinates.latitude,
        this.createLayer((tr.payload as GpsTriggerPayload).markerIcon)
      );
    });
    this.createLayer(environment.selfPositionIconPath);
    this.updateLocation();
  }

  createMap() {
    // create Map
    console.log('[MapComponent] Setting up map');
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          // use OpenStreetMap
          source: new ol.source.OSM(),
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 18,
      }),
    });

    this.mapView = this.map.getView();
    this.mapView.setZoom(18);
  }

  updateLocation() {
    let lat = 46,
      lon = 15;
    this.geolocation$.subscribe((locationData) => {
      this.centerView(locationData);
      this.updateMarker(
        locationData.coords.latitude,
        locationData.coords.longitude,
        1,
        this.markerMap.get(environment.selfPositionIconPath)
      );
    });
  }

  centerView(location: GeolocationPosition) {
    //console.log('[MapComponent] Centering view');
    this.mapView.setCenter(
      ol.proj.fromLonLat([location.coords.longitude, location.coords.latitude])
    );
  }

  private createMarkerForGps(
    lon: number,
    lat: number,
    layer: any,
    id?: number
  ): any {
    /*console.log(
      '[MapComponent] Creating marker at lon:' + lon + ', lat:' + lat
    );*/
    let marker = new ol.Feature(
      new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
    );
    marker.setId(id);
    //console.log('[MapComponent] Marker created: ', marker);
    layer.getSource().addFeature(marker);
    return marker;
  }

  private createLayer(url: string): any {
    if (!this.markerMap.get(url)) {
      //console.log('[MapComponent] Creating layer with url: ', url);
      let layer: any = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: url,
          }),
        }),
      });
      this.markerMap.set(url, layer);
      //console.log('[MapComponent] Adding layer ', layer);
      this.map.addLayer(layer);
    }
    return this.markerMap.get(url);
  }

  private updateMarker(lat: number, lon: number, id: number, layer: any) {
    let feature = layer.getSource().getFeatureById(id);
    if (!feature) {
      this.createMarkerForGps(lon, lat, layer, id);
    } else {
      let coord = ol.proj.fromLonLat([lon, lat]);
      feature.getGeometry().setCoordinates(coord);
    }
  }

  private removeMarker(id: number, layer: any) {
    let feature = layer.getSource().getFeatureById(id);
    //console.log(feature);
    layer.getSource().removeFeature(feature);
  }

  @HostListener('window:deviceorientation', ['$event', 'true'])
  rotateMap(event: DeviceOrientationEvent) {
    if (event.alpha && event.absolute) {
      this.mapView.setRotation(event.alpha * (Math.PI / 180));
    }
  }
}
