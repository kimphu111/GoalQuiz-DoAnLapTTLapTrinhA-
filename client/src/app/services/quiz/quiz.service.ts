import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private selectedDateSubject = new BehaviorSubject<string>('');
  selectedDate$ = this.selectedDateSubject.asObservable();

  private selectedLevelSubject = new BehaviorSubject<string>('mix');
  selectedLevel$ = this.selectedLevelSubject.asObservable();

  setSelectedDate(date: string) {
    this.selectedDateSubject.next(date);
  }

  clearSelectedDate() {
    this.selectedDateSubject.next('');
  }

  setSelectedLevel(level: string) {
    this.selectedLevelSubject.next(level);
  }

  clearSelectedLevel() {
    this.selectedLevelSubject.next('mix');
  }
}
