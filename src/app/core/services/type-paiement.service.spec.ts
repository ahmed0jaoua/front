import { TestBed } from '@angular/core/testing';

import { TypePaiementService } from './type-paiement.service';

describe('TypePaiementService', () => {
  let service: TypePaiementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypePaiementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
