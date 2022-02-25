import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private static readonly questionUrl: string =
    environment.apiUrl + '/question';
  constructor(private http: HttpClient) {}

  public submitQuestion(answer: { id: number; answers: string[] }) {
    this.http.post(QuestionService.questionUrl, answer);
  }
}
