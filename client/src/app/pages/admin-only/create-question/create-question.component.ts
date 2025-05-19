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
  //selectedLevel: string = '';

  constructor(private http: HttpClient){

  }

  createQuestion(){
    console.log('Input data: ', this.questionData);
    this.resetState();
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
