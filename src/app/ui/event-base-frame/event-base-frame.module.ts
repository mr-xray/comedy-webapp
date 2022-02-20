import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBaseFrameComponent } from './components/event-base-frame/event-base-frame.component';
import { EventTypeModule } from 'src/app/feature/event-type/event-type.module';

@NgModule({
  declarations: [EventBaseFrameComponent],
  imports: [CommonModule, EventTypeModule],
  exports: [EventBaseFrameComponent],
})
export class EventBaseFrameModule {}
