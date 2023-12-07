import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesreturnchallanComponent } from './salesreturnchallan.component';

describe('SalesreturnchallanComponent', () => {
  let component: SalesreturnchallanComponent;
  let fixture: ComponentFixture<SalesreturnchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesreturnchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesreturnchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
