import { Component, Input, OnInit } from '@angular/core';
import {
  ImageEventPayload,
  MultipleChoiceQuestionEventPayload,
} from 'src/app/data_access/websocket/util/events';

@Component({
  selector: 'app-multiple-choice-question-event',
  templateUrl: './multiple-choice-question-event.component.html',
  styleUrls: ['./multiple-choice-question-event.component.scss'],
})
export class MultipleChoiceQuestionEventComponent implements OnInit {
  @Input() public payload: MultipleChoiceQuestionEventPayload = {
    question: '',
    answers: [],
  };

  constructor() {}

  ngOnInit(): void {}
}
