import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletsalesreturnlistComponent } from './outletsalesreturnlist.component';

describe('OutletsalesreturnlistComponent', () => {
  let component: OutletsalesreturnlistComponent;
  let fixture: ComponentFixture<OutletsalesreturnlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletsalesreturnlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletsalesreturnlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
