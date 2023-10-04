import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardsoremainingComponent } from './outwardsoremaining.component';

describe('OutwardsoremainingComponent', () => {
  let component: OutwardsoremainingComponent;
  let fixture: ComponentFixture<OutwardsoremainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutwardsoremainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardsoremainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
