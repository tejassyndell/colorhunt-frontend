import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsallstocksComponent } from './reportsallstocks.component';

describe('ReportsallstocksComponent', () => {
  let component: ReportsallstocksComponent;
  let fixture: ComponentFixture<ReportsallstocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsallstocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsallstocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
