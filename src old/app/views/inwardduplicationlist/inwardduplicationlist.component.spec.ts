import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardduplicationlistComponent } from './inwardduplicationlist.component';

describe('InwardduplicationlistComponent', () => {
  let component: InwardduplicationlistComponent;
  let fixture: ComponentFixture<InwardduplicationlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardduplicationlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardduplicationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
