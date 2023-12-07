import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoremainingchallanComponent } from './soremainingchallan.component';

describe('SoremainingchallanComponent', () => {
  let component: SoremainingchallanComponent;
  let fixture: ComponentFixture<SoremainingchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoremainingchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoremainingchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
