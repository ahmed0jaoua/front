import { ComponentFixture, TestBed } from '@angular/core/testing';

import { creationfichederoute } from './creationfichederoute.component';

describe('creationfichederoute', () => {
  let component: creationfichederoute;
  let fixture: ComponentFixture<creationfichederoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [creationfichederoute]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(creationfichederoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
