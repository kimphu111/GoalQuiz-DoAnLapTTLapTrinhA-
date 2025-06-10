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

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private refreshFilterSubject = new BehaviorSubject<void>(undefined);
  refreshFilter$ = this.refreshFilterSubject.asObservable();

  setSelectedDate(date: string) {
    this.selectedDateSubject.next(date);
  }

  clearSelectedDate() {
    this.selectedDateSubject.next('');
    this.refreshFilterSubject.next();
  }

  setSelectedLevel(level: string) {
    this.selectedLevelSubject.next(level);
  }

  clearSelectedLevel() {
    this.selectedLevelSubject.next('mix');
    this.refreshFilterSubject.next();
  }

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term); // Cập nhật giá trị tìm kiếm
  }

  clearSearchTerm() {
    this.searchTermSubject.next('');
    this.refreshFilterSubject.next();
  }

  refreshFilter() {
    this.refreshFilterSubject.next();
  }
}
