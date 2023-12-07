import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardchallanComponent } from './outwardchallan.component';

describe('OutwardchallanComponent', () => {
  let component: OutwardchallanComponent;
  let fixture: ComponentFixture<OutwardchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutwardchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
