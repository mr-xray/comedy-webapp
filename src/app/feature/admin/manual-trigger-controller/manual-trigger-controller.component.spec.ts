import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualTriggerControllerComponent } from './manual-trigger-controller.component';

describe('ManualTriggerControllerComponent', () => {
  let component: ManualTriggerControllerComponent;
  let fixture: ComponentFixture<ManualTriggerControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualTriggerControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualTriggerControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
