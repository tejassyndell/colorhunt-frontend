import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SochallanComponent } from './sochallan.component';

describe('SochallanComponent', () => {
  let component: SochallanComponent;
  let fixture: ComponentFixture<SochallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SochallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SochallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
