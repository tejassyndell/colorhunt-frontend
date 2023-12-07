import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocktransferduplicateComponent } from './stocktransferduplicate.component';

describe('StocktransferduplicateComponent', () => {
  let component: StocktransferduplicateComponent;
  let fixture: ComponentFixture<StocktransferduplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocktransferduplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocktransferduplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
