import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SostatuslistComponent } from './sostatuslist.component';

describe('SostatuslistComponent', () => {
  let component: SostatuslistComponent;
  let fixture: ComponentFixture<SostatuslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SostatuslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SostatuslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
