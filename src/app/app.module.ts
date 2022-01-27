import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GpsModule } from './feature/gps/gps.module';
import { TitleBarModule } from './ui/title-bar/title-bar.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, GpsModule, TitleBarModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
