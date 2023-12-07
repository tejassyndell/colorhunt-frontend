import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocategorylistComponent } from './socategorylist.component';

describe('SocategorylistComponent', () => {
  let component: SocategorylistComponent;
  let fixture: ComponentFixture<SocategorylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocategorylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocategorylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
