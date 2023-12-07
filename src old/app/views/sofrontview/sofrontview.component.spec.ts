import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SofrontviewComponent } from './sofrontview.component';

describe('SofrontviewComponent', () => {
  let component: SofrontviewComponent;
  let fixture: ComponentFixture<SofrontviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SofrontviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SofrontviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
