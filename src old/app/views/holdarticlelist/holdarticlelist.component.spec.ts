import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldarticlelistComponent } from './holdarticlelist.component';

describe('HoldarticlelistComponent', () => {
  let component: HoldarticlelistComponent;
  let fixture: ComponentFixture<HoldarticlelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldarticlelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldarticlelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
