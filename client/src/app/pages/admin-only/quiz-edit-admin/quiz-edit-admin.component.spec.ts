import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizEditAdminComponent } from './quiz-edit-admin.component';

describe('QuizEditAdminComponent', () => {
  let component: QuizEditAdminComponent;
  let fixture: ComponentFixture<QuizEditAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizEditAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizEditAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
