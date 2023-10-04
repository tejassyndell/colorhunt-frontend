import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesizeComponent } from './articlesize.component';

describe('ArticlesizeComponent', () => {
  let component: ArticlesizeComponent;
  let fixture: ComponentFixture<ArticlesizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlesizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
