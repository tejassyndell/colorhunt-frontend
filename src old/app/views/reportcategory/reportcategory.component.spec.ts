import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportcategoryComponent } from './reportcategory.component';

describe('ReportcategoryComponent', () => {
  let component: ReportcategoryComponent;
  let fixture: ComponentFixture<ReportcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
