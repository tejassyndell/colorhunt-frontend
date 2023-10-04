import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlecolorComponent } from './articlecolor.component';

describe('ArticlecolorComponent', () => {
  let component: ArticlecolorComponent;
  let fixture: ComponentFixture<ArticlecolorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlecolorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlecolorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
