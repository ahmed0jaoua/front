import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonStatusComponent } from './bon-status.component';

describe(' BonDetailsComponent,', () => {
  let component:  BonStatusComponent;
  let fixture: ComponentFixture< BonStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  BonStatusComponent, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent( BonStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
