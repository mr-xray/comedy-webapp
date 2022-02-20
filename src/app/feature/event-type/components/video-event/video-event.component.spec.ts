import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEventComponent } from './video-event.component';

describe('VideoEventComponent', () => {
  let component: VideoEventComponent;
  let fixture: ComponentFixture<VideoEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
