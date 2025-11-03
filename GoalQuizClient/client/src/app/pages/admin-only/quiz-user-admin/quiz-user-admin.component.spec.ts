import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizUserAdminComponent } from './quiz-user-admin.component';

describe('QuizUserAdminComponent', () => {
  let component: QuizUserAdminComponent;
  let fixture: ComponentFixture<QuizUserAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizUserAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizUserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
