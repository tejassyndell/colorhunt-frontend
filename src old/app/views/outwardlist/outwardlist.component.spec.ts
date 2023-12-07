import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardlistComponent } from './outwardlist.component';

describe('OutwardlistComponent', () => {
  let component: OutwardlistComponent;
  let fixture: ComponentFixture<OutwardlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutwardlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
