import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TriggerRegistrationModule } from '../trigger-registration/trigger-registration.module';
import { SocketIoModule } from 'ngx-socket-io';

@NgModule({
  declarations: [],
  imports: [CommonModule, TriggerRegistrationModule, SocketIoModule],
  providers: [],
})
export class WebsocketModule {}
