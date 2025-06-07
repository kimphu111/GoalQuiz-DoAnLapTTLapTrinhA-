import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  NgIf,
  NgForOf,
  DatePipe,
  NgClass,
  CommonModule,
} from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { QuizService } from '../../../services/quiz/quiz.service';

@Component({
  selector: 'app-quiz-user-admin',
  templateUrl: './quiz-user-admin.component.html',
  styleUrls: ['./quiz-user-admin.component.scss'],
  standalone: true,
  imports: [NgIf, NgForOf, DatePipe, NgClass, CommonModule],
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
  username: string = 'Guest';
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 0;
  paginatedResults: any[] = [];
  pages: number[] = [];
  currentLevel: string = 'mix'; // Mức độ quiz hiện tại
  filteredResults: any[] = [];

  // private dateSub!: Subscription;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private http: HttpClient,
    private router: Router,
    private quizService: QuizService,
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'Guest';
    this.fetchAllQuizzes();

    this.subscriptions.add(
      combineLatest([
        this.quizService.selectedDate$,
        this.quizService.selectedLevel$,
      ]).subscribe(([date, level]) => {
        this.selectedDate = date;
        this.currentLevel = level;
        console.log(
          'Ngày được chọn:',
          this.selectedDate,
          'Mức độ:',
          this.currentLevel,
        );
        this.filterResults();
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions?.unsubscribe();
  }

  fetchAllQuizzes() {
    this.isLoading = true;
    const token = localStorage.getItem('accessToken') || '';
    if (!token) {
      console.error('Access token not found');
      this.isLoading = false;
      return;
    }
    this.allResults = [];
    this.filteredResults = [];

    this.http
      .get<any>('http://localhost:8000/api/play/getAllPlayerResult', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: (res) => {
          console.log('Dữ liệu API từ getAllPlayerResult:', res);
          Promise.all(
            res.map((item: any) => {
              console.log('Item quizLevel:', item.quizLevel);
              return fetch('http://localhost:8000/api/play/queryPlayerQuiz', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  idUser: item.idUser,
                  dateDoQuiz: item.dateDoQuiz,
                  quizLevel: item.quizLevel,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Dữ liệu từ queryPlayerQuiz:', data);
                  return {
                    idUser: item.idUser,
                    username: data.results?.[0]?.User?.username || 'Guest',
                    quizLevel: (
                      data.results?.[0]?.quizLevel ||
                      item.quizLevel ||
                      'N/A'
                    ).toLowerCase(),
                    dateDoQuiz: item.dateDoQuiz,
                    totalQuestions: item.totalQuestions,
                    totalScore: item.totalScore,
                  };
                });
            }),
          ).then((updatedResults) => {
            console.log('allResults sau ánh xạ:', updatedResults);
            this.allResults = updatedResults.sort(
              (a, b) =>
                new Date(b.dateDoQuiz).getTime() -
                new Date(a.dateDoQuiz).getTime(),
            );
            this.filteredResults = this.allResults; // Khởi tạo filteredResults
            this.filterResults();
            // this.filterResultsByDate(); // Áp dụng bộ lọc ngày nếu có
            this.selectLevel('mix'); // Áp dụng bộ lọc Mixed mặc định
            this.updatePagination();
            this.isLoading = false;
          });
        },
        error: (err) => {
          console.error('Lỗi API:', err);
          this.allResults = [];
          this.filteredResults = [];
          this.updatePagination();
          this.isLoading = false;
        },
      });
  }
  filterResults() {
    this.filteredResults = [...this.allResults].filter((item) => {
      // Chuẩn hóa định dạng ngày từ item.dateDoQuiz
      const quizDate = new Date(item.dateDoQuiz).toISOString().split('T')[0];
      const matchesDate = this.selectedDate
        ? quizDate === this.selectedDate
        : true;
      const matchesLevel =
        this.currentLevel === 'mix'
          ? true
          : item.quizLevel?.toLowerCase() === this.currentLevel.toLowerCase();
      console.log(
        `Item: ${quizDate}, Matches date: ${matchesDate}, Matches level: ${matchesLevel}`,
      );
      return matchesDate && matchesLevel;
    });
    console.log('Filtered results:', this.filteredResults);
    this.currentPage = 1;
    this.updatePagination();
  }
  filterResultsByDate() {
    if (!this.selectedDate) {
      this.filteredResults = this.allResults;
    } else {
      this.filteredResults = this.allResults.filter((item) => {
        const quizDate = new Date(item.dateDoQuiz).toISOString().split('T')[0];
        return quizDate === this.selectedDate;
      });
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredResults.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginatedResults = this.filteredResults.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize,
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  openDetail(idUser: string, dateDoQuiz: string) {
    this.selectedUser = idUser;
    this.selectedDate = dateDoQuiz;
    this.showDetailModal = false;

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
    this.selectedQuiz = {
      ...this.quizzes[index],
      index: index,
    };
  }

  selectLevel(level: string): void {
    this.currentLevel = level;
    this.isLoading = true;

    this.filteredResults = this.allResults.filter(
      (item) => item.quizLevel?.toLowerCase() === level.toLowerCase(),
    );

    this.currentPage = 1;
    this.updatePagination();
    this.isLoading = false;
  }
  clearFilters() {
    this.quizService.clearSelectedDate();
    this.quizService.clearSelectedLevel();
    this.selectedDate = '';
    this.currentLevel = 'mix';
    this.filterResults();
  }
}
