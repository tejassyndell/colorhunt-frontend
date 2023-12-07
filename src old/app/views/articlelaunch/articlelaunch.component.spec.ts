import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlelaunchComponent } from './articlelaunch.component';

describe('ArticlelaunchComponent', () => {
  let component: ArticlelaunchComponent;
  let fixture: ComponentFixture<ArticlelaunchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlelaunchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlelaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
