import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardlistComponent } from './inwardlist.component';

describe('InwardlistComponent', () => {
  let component: InwardlistComponent;
  let fixture: ComponentFixture<InwardlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
