import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutFicheSortantComponent } from './statutfichesortant.component';

describe(' BonDetailsComponent,', () => {
  let component:  StatutFicheSortantComponent;
  let fixture: ComponentFixture< StatutFicheSortantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  StatutFicheSortantComponent, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent( StatutFicheSortantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
