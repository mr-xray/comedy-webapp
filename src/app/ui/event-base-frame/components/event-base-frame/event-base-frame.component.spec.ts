import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBaseFrameComponent } from './event-base-frame.component';

describe('EventBaseFrameComponent', () => {
  let component: EventBaseFrameComponent;
  let fixture: ComponentFixture<EventBaseFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventBaseFrameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventBaseFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
