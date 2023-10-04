import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SochallanpdfComponent } from './sochallanpdf.component';

describe('SochallanpdfComponent', () => {
  let component: SochallanpdfComponent;
  let fixture: ComponentFixture<SochallanpdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SochallanpdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SochallanpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
