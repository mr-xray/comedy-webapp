import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceQuestionEventComponent } from './multiple-choice-question-event.component';

describe('MultipleChoiceQuestionEventComponent', () => {
  let component: MultipleChoiceQuestionEventComponent;
  let fixture: ComponentFixture<MultipleChoiceQuestionEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleChoiceQuestionEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceQuestionEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
