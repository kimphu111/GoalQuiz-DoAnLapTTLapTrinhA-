import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-quiz-user-admin',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './quiz-user-admin.component.html',
  styleUrls: ['./quiz-user-admin.component.scss'],
})
export class QuizUserAdminComponent implements OnInit {
  quizzes: any[] = [];
  isLoading = false;
  idUser: string = '';
  dateDoQuiz: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.idUser = params['idUser'];
      this.dateDoQuiz = params['dateDoQuiz'];

      console.log('Query Params:', {
        idUser: this.idUser,
        dateDoQuiz: this.dateDoQuiz,
      });

      if (this.idUser && this.dateDoQuiz) {
        this.fetchQuizData();
      } else {
        console.warn('Thiếu idUser hoặc dateDoQuiz trên URL.');
      }
    });
  }

  fetchQuizData() {
    const token = localStorage.getItem('accessToken');

    const url = `http://localhost:8000/api/play/queryPlayerQuiz?idUser=${this.idUser}&dateDoQuiz=${this.dateDoQuiz}`;

    this.isLoading = true;
    this.http
      .get<any>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe({
        next: (res) => {
          console.log('Kết quả từ API:', res);
          this.quizzes = res.results || [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('API error:', err);
          this.isLoading = false;
        },
      });
  }
}
