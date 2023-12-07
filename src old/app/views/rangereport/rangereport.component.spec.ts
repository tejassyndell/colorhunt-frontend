import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangereportComponent } from './rangereport.component';

describe('RangereportComponent', () => {
  let component: RangereportComponent;
  let fixture: ComponentFixture<RangereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
