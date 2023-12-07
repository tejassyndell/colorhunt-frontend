import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletlistComponent } from './outletlist.component';

describe('OutletlistComponent', () => {
  let component: OutletlistComponent;
  let fixture: ComponentFixture<OutletlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
