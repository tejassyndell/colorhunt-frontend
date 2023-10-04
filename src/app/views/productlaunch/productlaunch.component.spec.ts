import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductlaunchComponent } from './productlaunch.component';

describe('ProductlaunchComponent', () => {
  let component: ProductlaunchComponent;
  let fixture: ComponentFixture<ProductlaunchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductlaunchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductlaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
