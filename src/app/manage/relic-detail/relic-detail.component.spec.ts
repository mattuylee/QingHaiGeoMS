import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelicDetailComponent } from './relic-detail.component';

describe('RelicDetailComponent', () => {
  let component: RelicDetailComponent;
  let fixture: ComponentFixture<RelicDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelicDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
