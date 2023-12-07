import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RacklistComponent } from './racklist.component';

describe('RacklistComponent', () => {
  let component: RacklistComponent;
  let fixture: ComponentFixture<RacklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RacklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RacklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
