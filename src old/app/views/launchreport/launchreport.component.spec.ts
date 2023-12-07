import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchreportComponent } from './launchreport.component';

describe('LaunchreportComponent', () => {
  let component: LaunchreportComponent;
  let fixture: ComponentFixture<LaunchreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
