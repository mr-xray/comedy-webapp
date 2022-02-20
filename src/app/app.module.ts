import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtHttpInterceptor } from './data_access/authentication/interceptor/jwt-http.interceptor';
import { ConfigService } from './data_access/backend-endpoint/service/config.service';
import { EventTypeModule } from './feature/event-type/event-type.module';
import { GpsModule } from './feature/gps/gps.module';
import { EventBaseFrameModule } from './ui/event-base-frame/event-base-frame.module';
import { TitleBarModule } from './ui/title-bar/title-bar.module';

const config: SocketIoConfig = {
  url: 'https://jakob-galaxy.at:3000',
  options: {},
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GpsModule,
    EventBaseFrameModule,
    HttpClientModule,
    TitleBarModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
