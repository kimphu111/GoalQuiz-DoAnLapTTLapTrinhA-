import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-question',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.scss'
})
export class CreateQuestionComponent {
  questionData = {
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    level: '',
    image:  null as File | null ,
  };
  selectedFile: File | null = null;
  selectedImage: string | ArrayBuffer | null = null;
  errorFields: { [key: string]: boolean } = {};
  questionId: string = '';
  showQuestionId: boolean = false;
  showPopup = false;
  popupMessage: string = '';
  isEdit: boolean = false;
  popupType: 'success' | 'failed' = 'success';

  constructor(private http: HttpClient, 
              private route: ActivatedRoute, 
              private router: Router,
              private location: Location
            ){

  }

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id');
    const token = localStorage.getItem('accessToken');
    const httpOptions = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    if (id) {
      this.isEdit = true;
      this.http.get<any>(`http://localhost:8000/api/quiz/getQuizById/${id}`, httpOptions).subscribe({
        next: (res) => {
          const quiz = res.quiz;
          this.questionData = {
          question: res.quiz.question,
          optionA: res.quiz.answerA,
          optionB: res.quiz.answerB,
          optionC: res.quiz.answerC,
          optionD: res.quiz.answerD,
          correctAnswer: res.quiz.correctAnswer,
          level: res.quiz.level,
          image: null
        };
        this.questionId = res.quiz.id || quiz._id;
        this.selectedImage = quiz.image;
        },
        error: (err) => {
          if(err.status === 404) {
            this.showPopup = true;
            this.popupType = 'failed';
            this.popupMessage = 'Quiz not found!';
            setTimeout(() => {this.showPopup = false;}, 2000)
          }
        }
        
      });
    }
    else {
      this.isEdit = false;
    }
  }

  createQuestion(){
    const { question, optionA, optionB, optionC, optionD, correctAnswer, level, image } = this.questionData;

    this.errorFields = {
      question: !question.trim(),
      optionA: !optionA.trim(),
      optionB: !optionB.trim(),
      optionC: !optionC.trim(),
      optionD: !optionD.trim(),
      correctAnswer: !correctAnswer.trim(),
      level: !level.trim()
    };

    if (Object.values(this.errorFields).some(v => v)) {
      return;
    }

    const quizInformation = {
      question,
      answerA: optionA,
      answerB: optionB,
      answerC: optionC,
      answerD: optionD,
      correctAnswer,
      level,
    };

    const formData = new FormData();
    formData.append('quizInformation', JSON.stringify(quizInformation));

    if (image) {
      formData.append('quiz_image', image);
    }

    const token = localStorage.getItem('accessToken');
    const httpOptions = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    this.http.post<any>('http://localhost:8000/api/quiz/postQuiz', formData, httpOptions).subscribe({
      next: (res) => {
        // Xử lý thành công
        this.questionId = res.quiz?._id || res.quiz?.id || '';
        console.log('Input data: ', this.questionData);
        this.showQuestionId = true;
        this.resetState();
        this.showPopup = true;
        this.popupType = 'success';
        this.popupMessage = 'Create question success!';
        setTimeout(() => { this.showPopup = false; }, 1500);
        setTimeout(() => { this.showQuestionId = false; }, 300);
        this.errorFields = {};
        console.log('Quiz created successfully!');
      },
      error: (err) => {
        this.showPopup = true;
        this.popupType = 'failed';
        this.popupMessage = 'Quiz create failed';
         setTimeout(() => {
          this.showPopup = false;
        }, 1500);
        console.log('Quiz creation failed!');
      }
    });
  }

  updateQuiz() {
  const { question, optionA, optionB, optionC, optionD, correctAnswer, level, image } = this.questionData;

  const quizInformation = {
    id: this.questionId,
    question,
    answerA: optionA,
    answerB: optionB,
    answerC: optionC,
    answerD: optionD,
    correctAnswer,
    level,
  };
  console.log('Update with id:', this.questionId);

  const formData = new FormData();
  formData.append('quizInformation', JSON.stringify(quizInformation));
  if (image) {
    formData.append('quiz_image', image);
  }

  const token = localStorage.getItem('accessToken');
  const httpOptions = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  this.http.put<any>('http://localhost:8000/api/quiz/updateQuiz', formData, httpOptions).subscribe({
    next: (res) => {
      this.showPopup = true;
      this.showQuestionId = true;
      this.popupType = 'success';
      this.popupMessage = 'Update quiz success!';
      setTimeout(() => {this.showQuestionId = false; }, 300);
      setTimeout(() => {
        this.showPopup = false;
        this.router.navigate(['/admin/question-management']);
      }, 1500);
    },
    error: (err) => {
      this.showPopup = true;
      this.popupType = 'failed';
      this.popupMessage = 'Update quiz failed!';
      setTimeout(() => { this.showPopup = false; }, 1500);
      console.error('Update error:', err);
    }
  });
}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      this.questionData.image = file;

      // Đọc file để hiển thị preview
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  resetState() {
    this.questionData = {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      level: '',
      image: null
    };
    this.selectedFile = null;
    this.selectedImage = null;
  }

  get score(): number {
    switch(this.questionData.level){
      case 'easy': return 10;
      case 'medium': return 20;
      case 'hard': return 30;
      default: return 0;
    }
  }

  goBack(){
    this.location.back();
  }
  

}
