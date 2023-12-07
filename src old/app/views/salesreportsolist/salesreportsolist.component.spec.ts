import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesreportsolistComponent } from './salesreportsolist.component';

describe('SalesreportsolistComponent', () => {
  let component: SalesreportsolistComponent;
  let fixture: ComponentFixture<SalesreportsolistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesreportsolistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesreportsolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
