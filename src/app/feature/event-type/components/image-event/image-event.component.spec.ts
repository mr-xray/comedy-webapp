import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEventComponent } from './image-event.component';

describe('ImageEventComponent', () => {
  let component: ImageEventComponent;
  let fixture: ComponentFixture<ImageEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
