import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletchallanComponent } from './outletchallan.component';

describe('OutletchallanComponent', () => {
  let component: OutletchallanComponent;
  let fixture: ComponentFixture<OutletchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
