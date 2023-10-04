import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardreportComponent } from './outwardreport.component';

describe('OutwardreportComponent', () => {
  let component: OutwardreportComponent;
  let fixture: ComponentFixture<OutwardreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutwardreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
