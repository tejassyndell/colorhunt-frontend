import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationlistComponent } from './transportationlist.component';

describe(' TransportationlistComponent ', () => {
  let component: TransportationlistComponent ;
  let fixture: ComponentFixture< TransportationlistComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportationlistComponent  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( TransportationlistComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
