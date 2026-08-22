import { TestBed } from '@angular/core/testing';
import { BusinessState } from './business-state';

describe('BusinessState', () => {
  let service: BusinessState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
