import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgForOf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-quiz-user-admin',
  templateUrl: './quiz-user-admin.component.html',
  styleUrls: ['./quiz-user-admin.component.scss'],
  standalone: true,
  imports: [NgIf, NgForOf, DatePipe],
})
export class QuizUserAdminComponent implements OnInit {
  allResults: any[] = []; // danh sách tất cả kết quả
  quizzes: any[] = []; // kết quả chi tiết cho 1 user
  isLoading = false;
  showDetailModal = false;
  selectedUser: string = '';
  selectedDate: string = '';

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
          console.log('Dữ liệu API:', res); // ✅ Hiển thị mảng 4 phần tử
          this.allResults = res; // ✅ Gán trực tiếp
          this.isLoading = false;
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
        this.quizzes = res.results || []; // ✅ Gán đúng chỗ
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

  queryPlayerQuiz(idUser: string, dateDoQuiz: string) {
    const token = localStorage.getItem('accessToken') || '';

    const body = {
      idUser,
      dateDoQuiz,
    };

    this.http
      .post<any>('http://localhost:8000/api/play/queryPlayerQuiz', body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: (res) => {
          this.quizzes = res.results || [];
        },
        error: (err) => {
          console.error('Lỗi khi fetch detail:', err);
        },
      });
  }
}
