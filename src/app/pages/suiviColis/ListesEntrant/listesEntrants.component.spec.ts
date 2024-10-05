import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListesEntrantsComponent } from './listesEntrants.component';

describe('ListesEntrantsComponent', () => {
  let component: ListesEntrantsComponent;
  let fixture: ComponentFixture<ListesEntrantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListesEntrantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListesEntrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
