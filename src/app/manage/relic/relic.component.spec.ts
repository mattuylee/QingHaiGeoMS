import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelicComponent } from './relic.component';

describe('RelicComponent', () => {
  let component: RelicComponent;
  let fixture: ComponentFixture<RelicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
