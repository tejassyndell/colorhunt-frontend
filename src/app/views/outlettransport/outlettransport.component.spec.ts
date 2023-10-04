import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlettransportComponent } from './outlettransport.component';

describe('OutlettransportComponent', () => {
  let component: OutlettransportComponent;
  let fixture: ComponentFixture<OutlettransportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlettransportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlettransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
