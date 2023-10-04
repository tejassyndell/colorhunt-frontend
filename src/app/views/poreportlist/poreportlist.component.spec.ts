import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoreportlistComponent } from './poreportlist.component';

describe('PoreportlistComponent', () => {
  let component: PoreportlistComponent;
  let fixture: ComponentFixture<PoreportlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoreportlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoreportlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
