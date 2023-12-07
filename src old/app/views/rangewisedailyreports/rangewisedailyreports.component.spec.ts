import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangewisedailyreportsComponent } from './rangewisedailyreports.component';

describe('RangewisedailyreportsComponent', () => {
  let component: RangewisedailyreportsComponent;
  let fixture: ComponentFixture<RangewisedailyreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangewisedailyreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangewisedailyreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
