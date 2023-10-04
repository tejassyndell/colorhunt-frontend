import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangestokesreportsComponent } from './rangestokesreports.component';

describe('RangestokesreportsComponent', () => {
  let component: RangestokesreportsComponent;
  let fixture: ComponentFixture<RangestokesreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangestokesreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangestokesreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
