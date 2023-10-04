import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletsalesreturnComponent } from './outletsalesreturn.component';

describe('OutletsalesreturnComponent', () => {
  let component: OutletsalesreturnComponent;
  let fixture: ComponentFixture<OutletsalesreturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletsalesreturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletsalesreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
