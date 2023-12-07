import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovearticlelistComponent } from './approvearticlelist.component';

describe('ApprovearticlelistComponent', () => {
  let component: ApprovearticlelistComponent;
  let fixture: ComponentFixture<ApprovearticlelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovearticlelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovearticlelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
