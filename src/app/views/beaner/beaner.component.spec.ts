import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeanerComponent } from './beaner.component';

describe('BeanerComponent', () => {
  let component: BeanerComponent;
  let fixture: ComponentFixture<BeanerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeanerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
