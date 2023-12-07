import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesreportlistComponent } from './salesreportlist.component';

describe('SalesreportlistComponent', () => {
  let component: SalesreportlistComponent;
  let fixture: ComponentFixture<SalesreportlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesreportlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesreportlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
