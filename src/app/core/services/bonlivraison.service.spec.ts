import { TestBed } from '@angular/core/testing';

import { BonlivraisonService } from './bonlivraison.service';

describe('BonlivraisonService', () => {
  let service: BonlivraisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonlivraisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
