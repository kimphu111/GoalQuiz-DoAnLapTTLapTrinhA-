import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {

  constructor(private http: HttpClient) {}

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
    this.searchTermSubject.next(term);
  }

  clearSearchTerm() {
    this.searchTermSubject.next('');
    this.refreshFilterSubject.next();
  }

  refreshFilter() {
    this.refreshFilterSubject.next();
  }

  clearAllFilters() {
    this.selectedDateSubject.next('');
    this.selectedLevelSubject.next('mix');
    this.searchTermSubject.next('');
    this.refreshFilterSubject.next();
  }



  getQuiz(level: string): Observable<any> {
    let apiUrl= '';
    switch (level){
      case 'easy': apiUrl = 'http://localhost:8000/api/quiz/getEasyQuiz'; break;
      case 'medium': apiUrl = 'http://localhost:8000/api/quiz/getMediumQuiz'; break;
      case 'hard': apiUrl = 'http://localhost:8000/api/quiz/getHardQuiz'; break;
      case 'mix':
      case 'mixed': apiUrl = 'http://localhost:8000/api/quiz/getMixQuiz'; break;
      default: throw new Error('Invalid quiz level');
    }

    const token = localStorage.getItem('accessToken');
    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}`})}
      : {};
    return this.http.get(apiUrl, httpOptions);
  }

  submitAnswer(data: any): Observable<any> {
     const token = localStorage.getItem('accessToken');
    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
    return this.http.post('http://localhost:8000/api/play/postPlayerResult', data, httpOptions);
  }

  getUserResults(userId: string, date: string, level: string): Observable<any>{
    const token = localStorage.getItem('accessToken');
    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
    return this.http.get(
      `http://localhost:8000/api/play/review?dateDoQuiz=${date}&quizLevel=${level}`,
      httpOptions
    );
  }

  getAllResultsByDate(date: string): Observable<any>{
    const token = localStorage.getItem('accessToken');
    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
    return this.http.get(
      `http://localhost:8000/api/play/getAllPlayerResult?dateDoQuiz=${date}`,
      httpOptions
    );
  }
}
