import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHistoryAdminComponent } from './quiz-history-admin.component';

describe('QuizHistoryAdminComponent', () => {
  let component: QuizHistoryAdminComponent;
  let fixture: ComponentFixture<QuizHistoryAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizHistoryAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizHistoryAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
