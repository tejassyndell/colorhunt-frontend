import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialyearlistComponent } from './financialyearlist.component';

describe('FinancialyearlistComponent', () => {
  let component: FinancialyearlistComponent;
  let fixture: ComponentFixture<FinancialyearlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialyearlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialyearlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
