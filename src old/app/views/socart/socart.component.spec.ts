import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocartComponent } from './socart.component';

describe('SocartComponent', () => {
  let component: SocartComponent;
  let fixture: ComponentFixture<SocartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
