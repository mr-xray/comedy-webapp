import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageEventComponent } from './components/image-event/image-event.component';
import { VideoEventComponent } from './components/video-event/video-event.component';
import { AugmentedRealityEventComponent } from './components/augmented-reality-event/augmented-reality-event.component';
import { MultipleChoiceQuestionEventComponent } from './components/multiple-choice-question-event/multiple-choice-question-event.component';
import { EventContainerComponent } from './components/event-container/event-container.component';

@NgModule({
  declarations: [
    ImageEventComponent,
    VideoEventComponent,
    AugmentedRealityEventComponent,
    MultipleChoiceQuestionEventComponent,
    EventContainerComponent,
  ],
  imports: [CommonModule],
  exports: [EventContainerComponent],
})
export class EventTypeModule {}
