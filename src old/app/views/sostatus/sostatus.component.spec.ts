import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SostatusComponent } from './sostatus.component';

describe('SostatusComponent', () => {
  let component: SostatusComponent;
  let fixture: ComponentFixture<SostatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SostatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SostatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
