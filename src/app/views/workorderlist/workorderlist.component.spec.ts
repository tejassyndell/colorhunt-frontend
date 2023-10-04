import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderlistComponent } from './workorderlist.component';

describe('WorkorderlistComponent', () => {
  let component: WorkorderlistComponent;
  let fixture: ComponentFixture<WorkorderlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
