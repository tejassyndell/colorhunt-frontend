import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedarticlelistComponent } from './rejectedarticlelist.component';

describe('RejectedarticlelistComponent', () => {
  let component: RejectedarticlelistComponent;
  let fixture: ComponentFixture<RejectedarticlelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedarticlelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedarticlelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
