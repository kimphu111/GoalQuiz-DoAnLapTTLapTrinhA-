import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPointsComponent } from './personal-points.component';

describe('PersonalPointsComponent', () => {
  let component: PersonalPointsComponent;
  let fixture: ComponentFixture<PersonalPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalPointsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
