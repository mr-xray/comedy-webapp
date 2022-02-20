import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AugmentedRealityEventComponent } from './augmented-reality-event.component';

describe('AugmentedRealityEventComponent', () => {
  let component: AugmentedRealityEventComponent;
  let fixture: ComponentFixture<AugmentedRealityEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AugmentedRealityEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AugmentedRealityEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
