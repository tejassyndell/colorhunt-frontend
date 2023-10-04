import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeserieslistComponent } from './rangeserieslist.component';

describe('RangeserieslistComponent', () => {
  let component: RangeserieslistComponent;
  let fixture: ComponentFixture<RangeserieslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeserieslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeserieslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
