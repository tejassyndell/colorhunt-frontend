import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeseriesComponent } from './rangeseries.component';

describe('RangeseriesComponent', () => {
  let component: RangeseriesComponent;
  let fixture: ComponentFixture<RangeseriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeseriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeseriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
