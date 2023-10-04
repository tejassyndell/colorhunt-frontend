import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleimgslistComponent } from './articleimgslist.component';

describe('ArticleimgslistComponent', () => {
  let component: ArticleimgslistComponent;
  let fixture: ComponentFixture<ArticleimgslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleimgslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleimgslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
