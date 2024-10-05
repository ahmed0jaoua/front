import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonDetailsComponent } from './bon-details.component';

describe(' BonDetailsComponent,', () => {
  let component:  BonDetailsComponent;
  let fixture: ComponentFixture< BonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  BonDetailsComponent, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent( BonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
