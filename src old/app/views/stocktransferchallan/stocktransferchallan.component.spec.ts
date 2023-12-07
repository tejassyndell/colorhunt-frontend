import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocktransferchallanComponent } from './stocktransferchallan.component';

describe('StocktransferchallanComponent', () => {
  let component: StocktransferchallanComponent;
  let fixture: ComponentFixture<StocktransferchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocktransferchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocktransferchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
