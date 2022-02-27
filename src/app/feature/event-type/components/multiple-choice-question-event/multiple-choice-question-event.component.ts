import { Component, Input, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/data_access/backend-endpoint/service/question.service';
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
  private _payload: MultipleChoiceQuestionEventPayload = {
    question: '',
    answers: [],
  };
  public questionNumeration: [string, string, boolean][] = [];
  public question: string = '';
  private selectedAnswers: Map<string, boolean> = new Map<string, boolean>();
  @Input()
  public id: number = -1;
  @Input()
  set payload(pl: MultipleChoiceQuestionEventPayload) {
    this._payload = pl;
    this.questionNumeration = [];
    this.question = this._payload.question;
    let answerCode = 64;
    for (let answer of this._payload.answers) {
      answerCode++;
      if (answerCode > 90) {
        return;
      }
      this.selectedAnswers.set(String.fromCharCode(answerCode), false);
      this.questionNumeration.push([
        String.fromCharCode(answerCode),
        answer.answer,
        answer.correct,
      ]);
    }
  }

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {}

  public selectAnswer(src: string): void {
    this.selectedAnswers.set(src, !this.selectedAnswers.get(src));
    document.getElementById(src)?.classList.toggle('activated-answer');
  }

  public submitAnswer() {
    let answerCodes = [...this.selectedAnswers]
      .filter(([k, v]) => v)
      .map(([k, v]) => k);
    let answers = this.questionNumeration
      .filter((question) => answerCodes.includes(question[0]))
      .map((question) => question[1]);
    this.questionService.submitQuestion({
      id: this.id,
      answers: answers,
    });
  }
}
