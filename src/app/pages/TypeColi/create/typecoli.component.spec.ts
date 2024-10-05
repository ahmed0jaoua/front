import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeColiComponent } from './typecoli.component';

describe('TypeColiComponent', () => {
  let component: TypeColiComponent;
  let fixture: ComponentFixture<TypeColiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeColiComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TypeColiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
