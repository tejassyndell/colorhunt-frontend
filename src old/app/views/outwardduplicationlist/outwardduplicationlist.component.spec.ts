import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardduplicationlistComponent } from './outwardduplicationlist.component';

describe('OutwardduplicationlistComponent', () => {
  let component: OutwardduplicationlistComponent;
  let fixture: ComponentFixture<OutwardduplicationlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutwardduplicationlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardduplicationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
