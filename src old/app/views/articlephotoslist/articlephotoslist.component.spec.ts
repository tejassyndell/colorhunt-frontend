import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlephotoslistComponent } from './articlephotoslist.component';

describe('ArticlephotoslistComponent', () => {
  let component: ArticlephotoslistComponent;
  let fixture: ComponentFixture<ArticlephotoslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlephotoslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlephotoslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
