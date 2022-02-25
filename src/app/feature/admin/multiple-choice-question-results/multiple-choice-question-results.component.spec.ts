import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceQuestionResultsComponent } from './multiple-choice-question-results.component';

describe('MultipleChoiceQuestionResultsComponent', () => {
  let component: MultipleChoiceQuestionResultsComponent;
  let fixture: ComponentFixture<MultipleChoiceQuestionResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleChoiceQuestionResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceQuestionResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
