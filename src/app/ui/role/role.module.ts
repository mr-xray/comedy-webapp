import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './components/default/default.component';
import { TitleBarModule } from '../title-bar/title-bar.module';
import { EventBaseFrameModule } from '../event-base-frame/event-base-frame.module';
import { GpsModule } from 'src/app/feature/gps/gps.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { WebsocketModule } from 'src/app/data_access/websocket/websocket.module';
import { LoginModule } from 'src/app/feature/login/login.module';
import { IFrameXssBypassModule } from 'src/app/util/iframe-xss-bypass/iframe-xss-bypass.module';

@NgModule({
  declarations: [DefaultComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    GpsModule,
    EventBaseFrameModule,
    HttpClientModule,
    WebsocketModule,
    LoginModule,
    TitleBarModule,
    IFrameXssBypassModule,
  ],
  exports: [DefaultComponent],
})
export class RoleModule {}
