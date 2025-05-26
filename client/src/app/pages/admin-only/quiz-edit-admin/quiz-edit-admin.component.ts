import { Component, OnInit } from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quiz-edit-admin',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './quiz-edit-admin.component.html',
  styleUrl: './quiz-edit-admin.component.scss'
})
export class QuizEditAdminComponent implements OnInit {
  quizzes: any[] = [];
  showPopup = false;
  selectedIndex: number | null = null;
  showDetailPopup = false;
  quizDetail: any = null;

  constructor(private http: HttpClient){}

  ngOnInit(){
    this.getAllQuiz();
  }

  getAllQuiz(){
    const token = localStorage.getItem('accessToken');
    const httpOptions = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    this.http.get<any>('http://localhost:8000/api/quiz/getAllQuiz', httpOptions)
    .subscribe({
      next: res => {
        // this.quizzes = res.quizzes.map((q: any) => ({
        //   ...q,
        //   participants: Array.isArray(q.players) && q.players.length> 0 ? q.players.length: 0
        // }));
        this.quizzes = res.quizzes;
    },
    error: err => {
      console.log('Api error', err);
    }
  });
  }

  deleteQuiz(id:string, index: number){
    const token = localStorage.getItem('accessToken');
    console.log('Delete quiz', id, index);
    this.http.delete<any>(`http://localhost:8000/api/quiz/deleteQuiz/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: res => {
        console.log('Delete succes', res);
        this.quizzes.splice(index, 1);
        this.closePopup();
      },
      error: err =>{
        console.log('Delete ERROR', err);
      }
    });
  }

  getQuizDetail(id: string){
    const token = localStorage.getItem('accessToken');
    const httpOptions = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
     this.http.get<any>(`http://localhost:8000/api/quiz/getQuizById/${id}`, httpOptions)
    .subscribe({
      next: res => {
        this.quizDetail = res.quiz;
        this.showDetailPopup = true;
        console.log('Quiz detail:', res.quiz);
      },
      error: err => {
        console.error('Get quiz by ID error:', err);
      }
    });
  }

  openPopup(index:number) {
    this.showPopup = true;
    this.selectedIndex = index;
  }

  closePopup() {
    this.showPopup = false;
    this.selectedIndex = null;
  }

  closeDetailPopup(){
    this.showDetailPopup = false;
    this.quizDetail = null;
  }

}
