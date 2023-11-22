import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeanerlistComponent } from './beanerlist.component';

describe('BeanerlistComponent', () => {
  let component: BeanerlistComponent;
  let fixture: ComponentFixture<BeanerlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeanerlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeanerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
