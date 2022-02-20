import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import { GeolocationService, POSITION_OPTIONS } from '@ng-web-apis/geolocation';
import { WebsocketModule } from 'src/app/data_access/websocket/websocket.module';
import { TriggerRegistrationModule } from 'src/app/data_access/trigger-registration/trigger-registration.module';

@NgModule({
  declarations: [MapComponent],
  imports: [CommonModule, WebsocketModule, TriggerRegistrationModule],
  providers: [
    GeolocationService,
    {
      provide: POSITION_OPTIONS,
      useValue: { enableHighAccuracy: true, timeout: 3000, maximumAge: 1000 },
    },
  ],
  exports: [MapComponent],
})
export class GpsModule {}
