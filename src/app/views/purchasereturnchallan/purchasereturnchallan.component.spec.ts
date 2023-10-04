import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasereturnchallanComponent } from './purchasereturnchallan.component';

describe('PurchasereturnchallanComponent', () => {
  let component: PurchasereturnchallanComponent;
  let fixture: ComponentFixture<PurchasereturnchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasereturnchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasereturnchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
