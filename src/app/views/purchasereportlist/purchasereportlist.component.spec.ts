import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasereportlistComponent } from './purchasereportlist.component';

describe('PurchasereportlistComponent', () => {
  let component: PurchasereportlistComponent;
  let fixture: ComponentFixture<PurchasereportlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasereportlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasereportlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
