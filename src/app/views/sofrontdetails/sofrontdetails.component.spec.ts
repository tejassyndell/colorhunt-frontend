import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SofrontdetailsComponent } from './sofrontdetails.component';

describe('SofrontdetailsComponent', () => {
  let component: SofrontdetailsComponent;
  let fixture: ComponentFixture<SofrontdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SofrontdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SofrontdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
