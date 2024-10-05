import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModePaiementComponent } from './modepaiement.component';

describe('ModePaiementComponent', () => {
  let component: ModePaiementComponent;
  let fixture: ComponentFixture<ModePaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModePaiementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
