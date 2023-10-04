import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionlistComponent } from './rejectionlist.component';

describe('RejectionlistComponent', () => {
  let component: RejectionlistComponent;
  let fixture: ComponentFixture<RejectionlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectionlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
