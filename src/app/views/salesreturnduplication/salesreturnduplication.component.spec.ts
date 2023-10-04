import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesreturnduplicationComponent } from './salesreturnduplication.component';

describe('SalesreturnduplicationComponent', () => {
  let component: SalesreturnduplicationComponent;
  let fixture: ComponentFixture<SalesreturnduplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesreturnduplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesreturnduplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
