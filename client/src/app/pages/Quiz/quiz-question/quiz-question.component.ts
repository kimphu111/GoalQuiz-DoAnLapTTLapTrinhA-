import { Component } from '@angular/core';
import { Location, NgClass } from '@angular/common';
import { QuizService } from '../../../services/quiz/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-quiz-question',
  standalone: true,
  imports: [NgClass],
  templateUrl: './quiz-question.component.html',
  styleUrl: './quiz-question.component.scss'
})
export class QuizQuestionComponent {

  constructor(private location: Location,
              private quizService: QuizService,
              private router: Router,
              private route: ActivatedRoute
  ) {}

  shuffledOptions: string[] = [];
  questions: any[] = [];
  currentQuestion: any = null;
  currentIndex: number = 0;
  level= '';
  score = 0;

  selectedOption: string | null = null;
  answered = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      this.level = params['level'] || '';
      let filteredQuestions;

      if(this.level === 'mixed'){
        filteredQuestions = this.quizService.questions;
      } else{
        filteredQuestions = this.quizService.questions.filter(q => q.level === this.level);
      }

      if (filteredQuestions.length === 0) {
        console.log('No questions found for level:', this.level);
      }

      const shuffledQuestion = [...filteredQuestions].sort(() => Math.random()- 0.5);
      this.questions = shuffledQuestion.slice(0, 5) ;

      this.currentIndex = 0;
      this.currentQuestion = this.questions[this.currentIndex];
      this.score = 0;
      this.selectedOption = null;
      this.answered = false;
      this.setShuffledOptions();
    })
  }

  setShuffledOptions(): void {
    if(!this.currentQuestion){
      this.shuffledOptions = [];
      return;
    }
    const options = [
      this.currentQuestion.option1,
      this.currentQuestion.option2,
      this.currentQuestion.option3,
      this.currentQuestion.option4,
    ];
    this.shuffledOptions = this.shuffleArray(options);
  }
  

  private shuffleArray(array: string[]):string[]{
    return array
      .map(value => ({ value, sort: Math.random()}))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // getCurrentOptions(): string[] {
  //   if(!this.currentQuestion) return [];
  //   const options = [
  //     this.currentQuestion.option1,
  //     this.currentQuestion.option2,
  //     this.currentQuestion.option3,
  //     this.currentQuestion.option4
  //   ]
  //   return this.shuffleArray(options);
  // }

  selectAnswer(option: string): void {
    if(this.answered) return; // Prevent multiple answers
    this.selectedOption = option;
    this.answered = true;

    if (option === this.currentQuestion.answer) {
      this.score++;
    }
    setTimeout(() => this.nextQuestion(), 1300);
  }

  nextQuestion(): void {
    this.currentIndex++;
    this.selectedOption = null;
    this.answered = false;

    if(this.currentIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentIndex];
      this.setShuffledOptions();
    } else {
      this.currentQuestion = null;
      alert(`Quiz finished: Your score: ${this.score}/${this.questions.length}`);
      this.router.navigate(['/quiz']);
    }
  }

  goBack(): void{
    this.location.back();
  }
  
  getOptionLabel(index: number): string{
    return String.fromCharCode(65 + index);
  }
}
