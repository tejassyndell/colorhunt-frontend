import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlelauncheditComponent } from './articlelaunchedit.component';

describe('ArticlelauncheditComponent', () => {
  let component: ArticlelauncheditComponent;
  let fixture: ComponentFixture<ArticlelauncheditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlelauncheditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlelauncheditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
export { ArticlelauncheditComponent };

