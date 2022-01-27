import { TestBed } from '@angular/core/testing';

import { ExtraEventService } from './extra-event.service';

describe('ExtraEventService', () => {
  let service: ExtraEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtraEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
