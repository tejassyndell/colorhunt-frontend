import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletreportComponent } from './outletreport.component';

describe('OutletreportComponent', () => {
  let component: OutletreportComponent;
  let fixture: ComponentFixture<OutletreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
