import { Component, OnInit } from '@angular/core';
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
    //this.eventQueue.submitEvent(this.event);
    this.eventQueue.subscribe((ev) => {
      console.log('[MapComponent] New Event to draw');
      ev.triggers.forEach((t) => {
        if (t.type === TriggerType.GPS) {
        }
      });
    });
    //this.gpsPoints = this.gpsPoints.concat(extraEvents.getEvents);
    //this.gpsPoints = this.gpsPoints.concat(eventQueue.getSequence);
    this.geolocation$.subscribe((position) => {
      //this.centerView(position);
    });
  }

  private map: any;
  private mapView: any;
  private markerMap: Map<string, any>;

  reloadMap() {
    console.log('[MapComponent] Clearing map');
    Array.from(this.markerMap.values()).map((m) => null);
    this.createMap();
  }

  ngOnInit() {
    this.createMap();
    this.eventQueue.submission.subscribe((event) => {
      console.log('[MapComponent] New event to draw received');
      this.reloadMap();
      console.log('[MapComponent] Requesting unobsucre GPS-Triggers');
      this.eventQueue.unobscureGpsTriggers.forEach((t) =>
        this.createMarkerForGps(
          (t.payload as GpsTriggerPayload).coordinates.longitude,
          (t.payload as GpsTriggerPayload).coordinates.latitude,
          this.createLayer((t.payload as GpsTriggerPayload).markerIcon)
        )
      );
    });
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
    this.geolocation$.subscribe((locationData) =>
      this.centerView(locationData)
    );
  }

  centerView(location: GeolocationPosition) {
    console.log('[MapComponent] Centering view');
    this.mapView.setCenter(
      ol.proj.fromLonLat([location.coords.longitude, location.coords.latitude])
    );
  }

  private createMarkerForGps(lon: number, lat: number, layer: any): any {
    console.log('[MapComponent] Creating marker');
    let marker = new ol.Feature(
      new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
    );
    layer.getSource().addFeature(marker);
    return marker;
  }

  private createLayer(url: string): any {
    console.log('[MapComponent] Creating layer');
    if (!this.markerMap.get(url)) {
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
      this.map.addLayer(layer);
    }
    return this.markerMap.get(url);
  }
}
