import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleratechangeComponent } from './articleratechange.component';

describe('ArticleratechangeComponent', () => {
  let component: ArticleratechangeComponent;
  let fixture: ComponentFixture<ArticleratechangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleratechangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleratechangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
