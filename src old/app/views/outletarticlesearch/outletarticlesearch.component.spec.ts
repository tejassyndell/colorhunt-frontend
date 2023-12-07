import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletarticlesearchComponent } from './outletarticlesearch.component';

describe('OutletarticlesearchComponent', () => {
  let component: OutletarticlesearchComponent;
  let fixture: ComponentFixture<OutletarticlesearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletarticlesearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletarticlesearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
