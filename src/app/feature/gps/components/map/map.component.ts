import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { EventIdentifier } from 'src/app/data_access/websocket/util/events';
import {
  EventTriggerDto,
  ManualTriggerPayload,
  TriggerType,
} from 'src/app/data_access/websocket/util/triggers';
import { AppEvent } from 'src/app/data_access/websocket/util/types';
import { EventQueueService } from '../../service/event-queue.service';
import { CompassDirection, GpsTriggerPayload } from '../../util/gps-trigger';

declare var ol: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  //--------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------
  constructor(
    private eventQueue: EventQueueService,
    private geolocation$: GeolocationService
  ) {
    this.eventQueue = eventQueue;
    //this.eventQueue.submitEvent(this.event);
    this.eventQueue.subscribe((ev) => {
      console.log('Trigger ');
      ev.triggers.forEach((t) => {
        if (t.type === TriggerType.GPS) {
        }
      });
    });
    console.log(this.eventQueue);
    //this.gpsPoints = this.gpsPoints.concat(extraEvents.getEvents);
    //this.gpsPoints = this.gpsPoints.concat(eventQueue.getSequence);
    this.geolocation$.subscribe((position) => {
      //this.centerView(position);
    });
  }

  private map: any;
  private mapView: any;
  private markerUnknownLayer: any;
  //private markerUnknownLayer: any;
  private markerCheckLayer: any;
  private markerLayer: any;

  reloadMap() {
    this.map = null;
    this.mapView = null;
    this.markerUnknownLayer = null;
    this.createMap();
  }

  ngOnInit() {
    this.createMap();
    let asdf: EventTriggerDto[] = [];
    for (let t of asdf) {
      if (t.type === TriggerType.GPS) {
        /*console.log(
          t,
          (t.payload as GpsTriggerPayload).coordinates.longitude,
          (t.payload as GpsTriggerPayload).coordinates.latitude,
          this.markerUnknownLayer
        );*/
        this.createMarkerForGps(
          (t.payload as GpsTriggerPayload).coordinates.longitude,
          (t.payload as GpsTriggerPayload).coordinates.latitude,
          this.markerUnknownLayer
        );
      }
    }
    this.updateLocation();
  }

  createMap() {
    // create Map
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

    this.markerUnknownLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'https://upload.wikimedia.org/wikipedia/commons/6/69/How_to_use_icon.svg',
        }),
      }),
    });
    this.map.addLayer(this.markerUnknownLayer);
    this.mapView.setZoom(18);
  }

  updateLocation() {
    this.geolocation$.subscribe((locationData) =>
      this.centerView(locationData)
    );
  }

  centerView(location: GeolocationPosition) {
    this.mapView.setCenter(
      ol.proj.fromLonLat([location.coords.longitude, location.coords.latitude])
    );
  }

  private createMarkerForGps(lon: number, lat: number, layer: any): any {
    let marker = new ol.Feature(
      new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
    );
    layer.getSource().addFeature(marker);
    return marker;
  }
}
