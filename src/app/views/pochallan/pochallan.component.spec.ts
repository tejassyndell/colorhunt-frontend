import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PochallanComponent } from './pochallan.component';

describe('PochallanComponent', () => {
  let component: PochallanComponent;
  let fixture: ComponentFixture<PochallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PochallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PochallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
