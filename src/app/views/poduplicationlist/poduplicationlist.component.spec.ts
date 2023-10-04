import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoduplicationlistComponent } from './poduplicationlist.component';

describe('PoduplicationlistComponent', () => {
  let component: PoduplicationlistComponent;
  let fixture: ComponentFixture<PoduplicationlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoduplicationlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoduplicationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
