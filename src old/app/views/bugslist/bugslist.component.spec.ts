import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BugslistComponent } from './bugslist.component';

describe('BugslistComponent', () => {
  let component: BugslistComponent;
  let fixture: ComponentFixture<BugslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BugslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BugslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
