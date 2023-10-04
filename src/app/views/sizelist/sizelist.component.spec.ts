import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizelistComponent } from './sizelist.component';

describe('SizelistComponent', () => {
  let component: SizelistComponent;
  let fixture: ComponentFixture<SizelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
