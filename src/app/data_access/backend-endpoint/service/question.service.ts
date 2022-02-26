import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebsocketService } from '../../websocket/service/websocket.service';
import { AppEvent } from '../../websocket/util/types';
import { QuestionResultDto } from '../types';

@Injectable({
  providedIn: 'root',
})
export class QuestionService extends Subject<QuestionResultDto[]> {
  private static readonly questionUrl: string =
    environment.apiUrl + '/question';
  private questionStats: QuestionResultDto[] = [];
  constructor(private http: HttpClient) {
    super();
  }

  public requestResults() {
    console.log('[QuestionService] Requesting results');
    this.http
      .get(QuestionService.questionUrl)
      .subscribe((res) => this.handleAllQuestions(res as QuestionResultDto[]));
  }

  public handInQuestion(newQuestion: QuestionResultDto) {
    let question: QuestionResultDto | undefined = this.questionStats.find(
      (question) => question.id === newQuestion.id
    );
    if (question) {
      this.addAnswersToResults(newQuestion, question);
    } else {
      let addedQuestion = {
        id: newQuestion.id,
        question: newQuestion.question,
        answers: {},
      };
      this.questionStats.push(addedQuestion);
      this.addAnswersToResults(newQuestion, addedQuestion);
    }
    this.next(this.questionStats);
  }

  public submitQuestion(answer: { id: number; answers: string[] }) {
    console.log(QuestionService.questionUrl, answer);
    this.http.post(QuestionService.questionUrl, answer).subscribe((res) => {});
  }

  private addAnswersToResults(
    newQuestion: QuestionResultDto,
    question: QuestionResultDto
  ) {
    for (let answer of Object.entries(newQuestion.answers)) {
      if (question.answers[answer[0]]) {
        question.answers[answer[0]] += 1;
      } else {
        question.answers[answer[0]] = 1;
      }
    }
  }

  private handleAllQuestions(questions: QuestionResultDto[]) {
    this.questionStats = questions;
    console.log('[QuestionService] Questions received', this.questionStats);
    this.next(this.questionStats);
  }
}
