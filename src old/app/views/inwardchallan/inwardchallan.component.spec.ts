import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardchallanComponent } from './inwardchallan.component';

describe('InwardchallanComponent', () => {
  let component: InwardchallanComponent;
  let fixture: ComponentFixture<InwardchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
