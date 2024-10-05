import { TestBed } from '@angular/core/testing';

import { TypeColisServiceService } from './type-colis-service.service';

describe('TypeColisServiceService', () => {
  let service: TypeColisServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeColisServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
