import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlecolorlistComponent } from './articlecolorlist.component';

describe('ArticlecolorlistComponent', () => {
  let component: ArticlecolorlistComponent;
  let fixture: ComponentFixture<ArticlecolorlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlecolorlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlecolorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
