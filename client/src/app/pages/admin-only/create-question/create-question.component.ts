import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient){

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
      formData.append('image', image);
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
        setTimeout(() => {
          this.showQuestionId = false;
        }, 100);
        this.errorFields = {};
        console.log('Quiz created successfully!');
      },
      error: (err) => {
        console.log('Quiz creation failed!');
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
  

}
