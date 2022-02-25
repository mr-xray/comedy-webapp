import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { GpsTriggerPayload } from 'src/app/data_access/trigger-registration/trigger-type-controller';
import { TriggerType } from 'src/app/data_access/trigger-registration/triggers';
import { WebsocketService } from 'src/app/data_access/websocket/service/websocket.service';
import { EventQueueService } from 'src/app/feature/gps/service/event-queue.service';
import { environment } from 'src/environments/environment';

export declare var ol: any;
@Component({
  selector: 'app-admin-map',
  templateUrl: './admin-map.component.html',
  styleUrls: ['./admin-map.component.scss'],
})
export class AdminMapComponent implements OnInit {
  constructor(
    private eventQueue: EventQueueService,
    private websocket: WebsocketService
  ) {
    this.markerMap = new Map<string, any>();
    this.eventQueue = eventQueue;
    //this.eventQueue.submitEvent(this.event);
    this.eventQueue.subscribe((ev) => {
      //console.log('Trigger ');
      ev.triggers.forEach((t) => {
        if (t.type === TriggerType.GPS) {
        }
      });
    });
    //console.log(this.eventQueue);
    //this.gpsPoints = this.gpsPoints.concat(extraEvents.getEvents);
    //this.gpsPoints = this.gpsPoints.concat(eventQueue.getSequence);
  }

  private map: any;
  private mapView: any;
  private markerMap: Map<string, any>;
  private featureId: number = 1;
  public userLocations: Map<
    string,
    {
      featureId: number;
      role: string;
      location: { latitude: number; longitude: number };
    }
  > = new Map();

  reloadMap() {
    Array.from(this.markerMap.values()).map((m) => null);
    this.createMap();
  }

  ngOnInit() {
    this.createMap();
    this.mapView.setCenter(ol.proj.fromLonLat([15.539918, 46.800877]));
    this.eventQueue.unobscureGpsTriggers.forEach((t) =>
      this.createMarkerForGps(
        (t.payload as GpsTriggerPayload).coordinates.longitude,
        (t.payload as GpsTriggerPayload).coordinates.latitude,
        this.createLayer((t.payload as GpsTriggerPayload).markerIcon),
        ++this.featureId
      )
    );
    let layer = this.createLayer(environment.customerIconPath);
    this.websocket.userLocations.subscribe((location) => {
      let toRemove: boolean = !!this.userLocations.get(location.username);
      let featureId =
        this.userLocations.get(location.username)?.featureId ??
        ++this.featureId;
      //console.log('[Map]: new user movement detected, markerid', featureId);
      this.userLocations.set(location.username, {
        featureId: featureId,
        role: location.role,
        location: {
          latitude: location.location.latitude,
          longitude: location.location.longitude,
        },
      });
      /*console.log(
        '[Map]: placing new coords in map: ',
        this.userLocations.get(location.username)
      );*/
      if (toRemove) {
        /*console.log(
          '[Map]: Marker already exists for this feature, removing it'
        );*/
        this.removeMarker(featureId, layer);
      }
      this.createMarkerForGps(
        location.location.longitude,
        location.location.latitude,
        layer,
        featureId
      );
    });
    this.websocket.initLocationStream();
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
    this.mapView.setZoom(18);
  }

  centerView(location: GeolocationPosition) {
    this.mapView.setCenter(
      ol.proj.fromLonLat([location.coords.longitude, location.coords.latitude])
    );
  }

  private createMarkerForGps(
    lon: number,
    lat: number,
    layer: any,
    featureId: number
  ): any {
    let marker = new ol.Feature(
      new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
    );
    marker.setId(featureId);
    //console.log('creating marker with set id: ', marker.getId());
    layer.getSource().addFeature(marker);
    return marker;
  }

  private removeMarker(id: number, layer: any) {
    let feature = layer.getSource().getFeatureById(id);
    //console.log(feature);
    layer.getSource().removeFeature(feature);
  }

  private createLayer(url: string): any {
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
      //console.log('[Map] new layer: ', layer);
      this.map.addLayer(layer);
    }
    return this.markerMap.get(url);
  }
}
