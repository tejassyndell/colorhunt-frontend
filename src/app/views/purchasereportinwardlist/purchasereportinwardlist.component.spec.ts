import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasereportinwardlistComponent } from './purchasereportinwardlist.component';

describe('PurchasereportinwardlistComponent', () => {
  let component: PurchasereportinwardlistComponent;
  let fixture: ComponentFixture<PurchasereportinwardlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasereportinwardlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasereportinwardlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
