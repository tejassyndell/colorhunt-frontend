import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletsalesreturnchallanComponent } from './outletsalesreturnchallan.component';

describe('OutletsalesreturnchallanComponent', () => {
  let component: OutletsalesreturnchallanComponent;
  let fixture: ComponentFixture<OutletsalesreturnchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletsalesreturnchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletsalesreturnchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
