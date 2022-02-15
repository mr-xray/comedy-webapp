import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import {
  EventIdentifier,
  MultipleChoiceQuestionEventPayload,
} from 'src/app/data_access/websocket/util/events';
import {
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
  private event: AppEvent = {
    id: 1, // Damit man die verschiedenen Objekte besser filtern, mappen, etc. kann
    triggers: [
      // Durch welche Trigger kann das Event getriggert werden?
      {
        id: 1,
        type: TriggerType.GPS,
        priority: 64,
        payload: new GpsTriggerPayload(
          false,
          1,
          'https://upload.wikimedia.org/wikipedia/commons/6/69/How_to_use_icon.svg',
          5,
          CompassDirection.EAST,
          'trigger description asdf',
          {
            latitude: 46.801052,
            longitude: 15.539782,
          }
        ),
      },
      {
        id: 3,
        type: TriggerType.GPS,
        priority: 64,
        payload: new GpsTriggerPayload(
          false,
          0,
          'https://upload.wikimedia.org/wikipedia/commons/6/69/How_to_use_icon.svg',
          5,
          CompassDirection.EAST,
          'trigger description asdf',
          {
            latitude: 46.800993,
            longitude: 15.541868,
          }
        ),
      },
      {
        id: 2,
        type: TriggerType.MANUAL,
        priority: 128,
        payload: new ManualTriggerPayload(10000),
      },
    ],
    finish: false,
    name: 'Event 1 gps',
    description: 'Event descirption',
    type: EventIdentifier.MULTIPLE_CHOICE,
    payload: {
      question: 'Question 1??',
      answers: [
        {
          answer: 'answer111',
          correct: true,
        },
        {
          answer: 'answer222',
          correct: false,
        },
        {
          answer: 'answer333',
          correct: false,
        },
        {
          answer: 'answer444',
          correct: true,
        },
      ],
    },
  };
  //------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------
  constructor(
    private eventQueue: EventQueueService,
    private geolocation$: GeolocationService
  ) {
    this.eventQueue = eventQueue;
    this.eventQueue.submitEvent(this.event);
    this.eventQueue.observable.subscribe((ev) => {
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
    for (let t of this.event.triggers) {
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
