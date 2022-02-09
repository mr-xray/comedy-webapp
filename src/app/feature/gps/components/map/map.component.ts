import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import {
  AppEvent,
  EventTypes,
  TriggerTypes,
} from 'src/app/data_access/websocket/util/types';
import { EventQueueService } from '../../service/event-queue.service';
import { ExtraEventService } from '../../service/extra-event.service';
import { GpsMarkerTypes, GpsPayload, GpsTrigger } from '../../util/gps-trigger';

declare var ol: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private gpsPoints: Map<number, any> = new Map<number, any>();
  private eventTrigger: Map<number, GpsTrigger[]> = new Map<
    number,
    GpsTrigger[]
  >();
  constructor(
    private extraEvents: ExtraEventService,
    private eventQueue: EventQueueService,
    private geolocation$: GeolocationService
  ) {
    const event: AppEvent = {
      eventId: 1, // Damit man die verschiedenen Objekte besser filtern, mappen, etc. kann
      triggers: [
        // Durch welche Trigger kann das Event getriggert werden?
        new GpsTrigger(
          {
            lat: 1,
            lon: 1,
            radiusInMeter: 5,
          },
          GpsMarkerTypes.UNKNOWN // Der Trigger soll auf der Karte durch ein "?"-Symbol dargestellt werden
        ),
      ],
      ignoreOrder: true, // Das Event muss nicht in Reihenfolge getriggert werden
      deliverable: true, // Das Event ist noch zustellbar (wurde noch nicht getriggert / vom Admin gesperrt )
      event: {
        name: 'event Station xy',
        description: 'dummy description',
        type: EventTypes.Image,
        payload: {
          size: {
            width: 100,
            height: 100,
          },
          url: 'path/to/image.png',
        },
      },
    };
    event.deliverable = true;
    extraEvents.submitPoint(event);
    extraEvents.subscribe((x) => {
      x;
    });
    extraEvents.getEvents.forEach((event) =>
      //this.gpsPoints.set(event.eventId, this.createMarkerForGps(event.triggers.))
      event.triggers.forEach((trigger) => {
        if (trigger.type === TriggerTypes.Gps) {
          this.gpsPoints.set(trigger);
        }
      })
    );
    this.gpsPoints = this.gpsPoints.concat(extraEvents.getEvents);
    this.gpsPoints = this.gpsPoints.concat(eventQueue.getSequence);
    this.geolocation$.subscribe((position) => {
      this.centerView(position);
    });
  }

  private map: any;
  private mapView: any;
  private markerUnknownLayer: any;
  private markerCheckLayer: any;
  private markerGoalLayer: any;

  reloadMap() {
    this.map = null;
    this.mapView = null;
    this.markerUnknownLayer = null;
    this.createMap();
  }

  ngOnInit() {
    this.createMap();
  }

  createMap() {
    // set test marker
    const iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([15.541138, 46.801486])),
      name: 'Somewhere near Nottingham',
    });

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
          src: 'assets/images/marker_unknown.svg',
        }),
      }),
    });
    this.map.addLayer(this.markerUnknownLayer);
    this.mapView.setZoom(18);
  }

  centerView(location: GeolocationPosition) {
    console.log(
      `center map to: ${location.coords.longitude} ${location.coords.latitude}`
    );
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
