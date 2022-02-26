import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/data_access/backend-endpoint/service/config.service';
import { QuestionService } from 'src/app/data_access/backend-endpoint/service/question.service';
import { QuestionResultDto } from 'src/app/data_access/backend-endpoint/types';
import { WebsocketService } from 'src/app/data_access/websocket/service/websocket.service';
import {
  EventIdentifier,
  MultipleChoiceQuestionEventPayload,
} from 'src/app/data_access/websocket/util/events';
import { AppEvent } from 'src/app/data_access/websocket/util/types';
import { EventQueueService } from '../../gps/service/event-queue.service';

@Component({
  selector: 'app-multiple-choice-question-results',
  templateUrl: './multiple-choice-question-results.component.html',
  styleUrls: ['./multiple-choice-question-results.component.scss'],
})
export class MultipleChoiceQuestionResultsComponent implements OnInit {
  constructor(private questionService: QuestionService) {
    console.log(
      '[MultipleChoiceQuestionResultComponent] Requesting question results'
    );
    this.questionService.subscribe((results) => {
      this.questions = results;
      console.log('[MultipleChoiceQuestionResultComponent] Results received');
    });
    this.questionService.requestResults();
  }
  public questions: QuestionResultDto[] = [];

  ngOnInit(): void {}
}
