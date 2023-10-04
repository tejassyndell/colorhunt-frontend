import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlelaunchlistComponent } from './articlelaunchlist.component';

describe('ArticlelaunchlistComponent', () => {
  let component: ArticlelaunchlistComponent;
  let fixture: ComponentFixture<ArticlelaunchlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlelaunchlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlelaunchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
