import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtHttpInterceptor } from './data_access/authentication/interceptor/jwt-http.interceptor';
import { ConfigService } from './data_access/backend-endpoint/service/config.service';
import { WebsocketService } from './data_access/websocket/service/websocket.service';
import { WebsocketModule } from './data_access/websocket/websocket.module';
import { AdminModule } from './feature/admin/admin.module';
import { EventTypeModule } from './feature/event-type/event-type.module';
import { GpsModule } from './feature/gps/gps.module';
import { LoginModule } from './feature/login/login.module';
import { EventBaseFrameModule } from './ui/event-base-frame/event-base-frame.module';
import { RoleModule } from './ui/role/role.module';
import { TitleBarModule } from './ui/title-bar/title-bar.module';
import { IFrameXssBypassModule } from './util/iframe-xss-bypass/iframe-xss-bypass.module';
import { IFrameTrustedPipe } from './util/iframe-xss-bypass/pipe/iframe-trusted.pipe';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GpsModule,
    EventBaseFrameModule,
    HttpClientModule,
    WebsocketModule,
    LoginModule,
    RoleModule,
    TitleBarModule,
    IFrameXssBypassModule,
    SocketIoModule.forRoot(WebsocketService.SOCKET_CONFIG),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
