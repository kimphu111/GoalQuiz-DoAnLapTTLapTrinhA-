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
import { format } from 'date-fns';

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
  currentLevel: string = 'mix';
  filteredResults: any[] = [];
  protected searchTerm: string = '';

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
        this.quizService.searchTerm$,
      ]).subscribe(([date, level, searchTerm]) => {
        this.selectedDate = date;
        this.currentLevel = level || 'mix';
        this.searchTerm = searchTerm;
        console.log('QuizService update:', { date, level, searchTerm }); // Debug
        this.filterResults();
      }),
    );
    this.subscriptions.add(
      this.quizService.refreshFilter$.subscribe(() => {
        console.log('Refresh filter triggered'); // Debug
        this.currentLevel = 'mix';
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
            this.filteredResults = this.allResults;
            this.filterResults();
            this.selectLevel('mix');
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
  filterResults(): void {
    this.filteredResults = this.allResults.filter((item) => {
      const quizDate = format(new Date(item.dateDoQuiz), 'yyyy-MM-dd');
      const matchesDate = this.selectedDate ? quizDate === this.selectedDate : true;
      const matchesLevel = item.quizLevel?.toLowerCase() === this.currentLevel.toLowerCase();
      const matchesSearch = this.searchTerm
        ? item.username.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      return matchesDate && matchesLevel && matchesSearch;
    });
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
    this.quizService.setSelectedLevel(level); // Đồng bộ với QuizService
    this.filterResults(); // Sử dụng filterResults để lọc
    this.isLoading = false;
  }

  clearFilters() {
    this.quizService.clearAllFilters();
    this.selectedDate = '';
    this.currentLevel = 'mix';
    this.searchTerm = '';
    this.filterResults();
  }
}
