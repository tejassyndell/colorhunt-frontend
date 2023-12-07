import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllremainingComponent } from './allremaining.component';

describe('AllremainingComponent', () => {
  let component: AllremainingComponent;
  let fixture: ComponentFixture<AllremainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllremainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllremainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
