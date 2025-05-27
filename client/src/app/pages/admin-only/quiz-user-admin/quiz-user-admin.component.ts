import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgForOf, DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-quiz-user-admin',
  templateUrl: './quiz-user-admin.component.html',
  styleUrls: ['./quiz-user-admin.component.scss'],
  standalone: true,
  imports: [NgIf, NgForOf, DatePipe, NgClass],
})
export class QuizUserAdminComponent implements OnInit {
  allResults: any[] = [];
  quizzes: any[] = [];
  isLoading = false;
  showDetailModal = false;
  selectedUser: string = '';
  selectedDate: string = '';
  selectedQuiz: any = null;
  idUser: any = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAllQuizzes();
  }

  fetchAllQuizzes() {
    this.isLoading = true;
    const token = localStorage.getItem('accessToken') || '';

    this.http
      .get<any>('http://localhost:8000/api/play/getAllPlayerResult', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: (res) => {
          console.log('Dữ liệu API:', res);
          this.allResults = res;
          this.isLoading = false;

          this.openDetail(
            '52ba2944-6ddb-4d03-8641-ba7b26699ff8',
            '2025-05-26T14:33:55.049Z',
            //lay theo iduser
          );
          this.showDetailModal = false;
        },
        error: (err) => {
          console.error('Lỗi API:', err);
          this.isLoading = false;
        },
      });
  }

  openDetail(idUser: string, dateDoQuiz: string) {
    this.selectedUser = idUser;
    this.selectedDate = dateDoQuiz;
    this.showDetailModal = true;

    // Gọi API lấy chi tiết kết quả quiz
    fetch('http://localhost:8000/api/play/queryPlayerQuiz', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idUser: idUser,
        dateDoQuiz: dateDoQuiz,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log('Chi tiết quiz:', res);
        this.quizzes = res.results || [];

        //mo san cau1
        if (this.quizzes.length > 0) {
          this.selectedQuiz = this.quizzes[0];
        }
        this.showDetailModal = true;
      })
      .catch((err) => {
        console.error('Lỗi khi lấy chi tiết quiz:', err);
        this.quizzes = [];
      });
  }

  closeDetail() {
    this.showDetailModal = false;
    this.quizzes = [];
  }

  selectQuiz(index: number) {
    this.selectedQuiz = this.quizzes[index];
  }
}
