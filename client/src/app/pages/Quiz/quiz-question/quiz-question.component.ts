import { Component } from '@angular/core';
import { Location, NgClass, CommonModule } from '@angular/common'; // Import CommonModule
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

// Define Question interface
interface RawQuestion {
	id: string;
	level: 'easy' | 'medium' | 'hard';
	question: string;
	answerA: string;
	answerB: string;
	answerC: string;
	answerD: string;
	correctAnswer: 'A' | 'B' | 'C' | 'D';
	image?: string;
	score: number;
}

interface QuizQuestion extends RawQuestion {
	options: string[];
	answer: string;
}

@Component({
  selector: 'app-quiz-question',
  standalone: true,
  imports: [NgClass, CommonModule], // Add CommonModule to imports
  templateUrl: './quiz-question.component.html',
  styleUrl: './quiz-question.component.scss'
})


export class QuizQuestionComponent {
	questions: QuizQuestion[] = [];
	currentQuestion: QuizQuestion | null = null;
	currentIndex: number = 0;
	level: string = '';
	score: number = 0;
	selectedOption: string | null = null;
	answered: boolean = false;
	
    constructor(
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.level = params['level'] || 'easy';
            this.fetchQuiz(this.level);
        });
    }

    fetchQuiz(level: string): void{
        let apiUrl = '';

        switch(level){
            case 'easy':
                apiUrl = 'http://localhost:8000/api/quiz/getEasyQuiz';
                break;
            case 'medium':
                apiUrl = 'http://localhost:8000/api/quiz/getMediumQuiz';
                break;
            case 'difficult':
                apiUrl = 'http://localhost:8000/api/quiz/getHardQuiz';
                break;
            case 'mixed':
                apiUrl = 'http://localhost:8000/api/quiz/getMixQuiz';
                break;
            default:
                alert('Invalid quiz level!');
                this.router.navigate(['/quiz']);
                return;
        }

        this.http
            .get<any>(apiUrl)
            .pipe(
                catchError((err) => {
                    alert('Error fetching quiz!');
                    this.router.navigate(['/quiz']);
                    return of(null);
                })
            )
            .subscribe((res) => {
                console.log('Quiz data:', res);
                if(!res || !res.success || !res.data){
                    alert('No quiz data received!');
                    this.router.navigate(['/quiz']);
                    return;
                }

                this.questions = res.data.map((q: RawQuestion) => {
                    const optionMap = {
                        A: q.answerA,
                        B: q.answerB,
                        C: q.answerC,
                        D: q.answerD,
                    };

                    const options = this.shuffleArray([
                        q.answerA,
                        q.answerB,
                        q.answerC,
                        q.answerD,
                    ])
                    return {
                        ...q,
                        options,
                        answer: optionMap[q.correctAnswer],
                    };
                });

                this.currentIndex = 0;
                this.score = 0;
                this.setCurrentQuestion();
            });
    }

    setCurrentQuestion(): void{
        this.currentQuestion = this.questions[this.currentIndex];
        this.selectedOption = null;
        this.answered = false;
    }

    selectAnswer(option: string): void{
        if(this.answered || !this.currentQuestion) return;

        this.selectedOption = option;
        this.answered = true;

        if(option === this.currentQuestion.answer){
            this.score++;
        }

        setTimeout(() => this.nextQuestion(), 1300);
    }

    nextQuestion(): void{
        this.currentIndex++;

        if(this.currentIndex < this. questions.length){
            this.setCurrentQuestion();
        }else{
            alert(`Quiz finished! Your score: ${this.score}/${this.questions.length}`);
            this.router.navigate(['/quiz']);
        }
    }

    private shuffleArray(array: string[]):string[]{
    return array
        .map(value => ({ value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    }

    goBack(): void {
        this.location.back();
    }

    getOptionLabel(index: number): string {
        return String.fromCharCode(65 + index);
    }

    trackOption(index: number, option: string): string {
        return option;
    }
}
