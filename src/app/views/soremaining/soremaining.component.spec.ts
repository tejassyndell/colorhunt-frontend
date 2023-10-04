import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoremainingComponent } from './soremaining.component';

describe('SoremainingComponent', () => {
  let component: SoremainingComponent;
  let fixture: ComponentFixture<SoremainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoremainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoremainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
