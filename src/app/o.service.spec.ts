import { TestBed } from '@angular/core/testing';

import { OService } from './o.service';

describe('OService', () => {
  let service: OService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
