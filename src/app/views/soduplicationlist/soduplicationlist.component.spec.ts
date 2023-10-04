import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoduplicationlistComponent } from './soduplicationlist.component';

describe('SoduplicationlistComponent', () => {
  let component: SoduplicationlistComponent;
  let fixture: ComponentFixture<SoduplicationlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoduplicationlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoduplicationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
