import { TestBed } from '@angular/core/testing';

import { JwtHttpInterceptor } from './jwt-http.interceptor';

describe('JwtHttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      JwtHttpInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: JwtHttpInterceptor = TestBed.inject(JwtHttpInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
