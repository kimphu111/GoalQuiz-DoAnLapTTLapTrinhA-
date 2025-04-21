import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor() { }

  questions = [
    {
      id: 1,
      level: 'easy',
      question: 'What is the capital of France ?',
      option1: 'Paris',
      option2: 'London',
      option3: 'Brelin',
      option4: 'Madris',
      answer: 'Paris',
      image: null
    },
    {
      id: 2,
      level: 'easy',
      question: 'Who won the FIFA World Cup in 2018?',
      option1: 'Brazil',
      option2: 'Germany',
      option3: 'France',
      option4: 'Argentina',
      answer: 'France',
      image: null
    },
    {
      id: 3,
      level: 'easy',
      question: 'What is the largest planet in our solar system?',
      option1: 'Earth',
      option2: 'Mars',
      option3: 'Jupiter',
      option4: 'Saturn',
      answer: 'Jupiter',
      image: null
    },
    {
      id: 4,
      level: 'easy',
      question: 'Which programming language is used for Angular?',
      option1: 'JavaScript',
      option2: 'Python',
      option3: 'TypeScript',
      option4: 'Ruby',
      answer: 'TypeScript',
      image: null
    },
    {
      id: 5,
      level: 'normal',
      question: 'Which country hosted the 2014 FIFA World Cup?',
      option1: 'Brazil',
      option2: 'Russia',
      option3: 'South Africa',
      option4: 'Germany',
      answer: 'Brazil',
      image: null
    },
    {
      id: 6,
      level: 'normal',
      question: 'Who is known as the "King of Football"?',
      option1: 'Maradona',
      option2: 'Pele',
      option3: 'Messi',
      option4: 'Ronaldo',
      answer: 'Pele',
      image: null
    },
    {
      id: 7,
      level: 'normal',
      question: 'Which team won the UEFA Champions League in 2020?',
      option1: 'Bayern Munich',
      option2: 'PSG',
      option3: 'Liverpool',
      option4: 'Real Madrid',
      answer: 'Bayern Munich',
      image: null
    },
    {
      id: 8,
      level: 'normal',
      question: 'What is the regulation length of a football match?',
      option1: '80 minutes',
      option2: '90 minutes',
      option3: '100 minutes',
      option4: '120 minutes',
      answer: '90 minutes',
      image: null
    },
    {
      id: 9,
      level: 'medium',
      question: 'Which player has won the most Ballon d\'Or awards?',
      option1: 'Cristiano Ronaldo',
      option2: 'Lionel Messi',
      option3: 'Michel Platini',
      option4: 'Johan Cruyff',
      answer: 'Lionel Messi',
      image: null
    },
    {
      id: 10,
      level: 'medium',
      question: 'Which country has won the most FIFA World Cups?',
      option1: 'Germany',
      option2: 'Italy',
      option3: 'Brazil',
      option4: 'Argentina',
      answer: 'Brazil',
      image: null
    },
    {
      id: 11,
      level: 'medium',
      question: 'Which club has the most UEFA Champions League titles?',
      option1: 'AC Milan',
      option2: 'Liverpool',
      option3: 'Real Madrid',
      option4: 'Barcelona',
      answer: 'Real Madrid',
      image: null
    },
    {
      id: 12,
      level: 'medium',
      question: 'Who scored the "Hand of God" goal?',
      option1: 'Diego Maradona',
      option2: 'Pele',
      option3: 'Zinedine Zidane',
      option4: 'David Beckham',
      answer: 'Diego Maradona',
      image: null
    },
    {
      id: 13,
      level: 'medium',
      question: 'Which country won the first ever FIFA World Cup?',
      option1: 'Uruguay',
      option2: 'Brazil',
      option3: 'Italy',
      option4: 'France',
      answer: 'Uruguay',
      image: null
    },
    {
      id: 14,
      level: 'difficult',
      question: 'Which club did Zinedine Zidane play for before joining Real Madrid?',
      option1: 'Juventus',
      option2: 'Bordeaux',
      option3: 'Monaco',
      option4: 'Marseille',
      answer: 'Juventus',
      image: null
    },
    {
      id: 15,
      level: 'difficult',
      question: 'Who is the all-time top scorer in the English Premier League?',
      option1: 'Wayne Rooney',
      option2: 'Alan Shearer',
      option3: 'Thierry Henry',
      option4: 'Sergio Agüero',
      answer: 'Alan Shearer',
      image: null
    },
    {
      id: 16,
      level: 'difficult',
      question: 'Which country won the UEFA Euro 2004?',
      option1: 'Portugal',
      option2: 'Greece',
      option3: 'Spain',
      option4: 'France',
      answer: 'Greece',
      image: null
    },
    {
      id: 17,
      level: 'difficult',
      question: 'Who was the captain of Spain when they won the 2010 FIFA World Cup?',
      option1: 'Xavi',
      option2: 'Iker Casillas',
      option3: 'Sergio Ramos',
      option4: 'Andres Iniesta',
      answer: 'Iker Casillas',
      image: null
    },
    {
      id: 18,
      level: 'difficult',
      question: 'Which African country reached the quarter-finals of the 1990 FIFA World Cup?',
      option1: 'Nigeria',
      option2: 'Cameroon',
      option3: 'Ghana',
      option4: 'Senegal',
      answer: 'Cameroon',
      image: null
    },
    {
      id: 19,
      level: 'easy',
      question: 'Which country does this flag belong to?',
      option1: 'Brazil',
      option2: 'Argentina',
      option3: 'Italy',
      option4: 'France',
      answer: 'Brazil',
      image: 'https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg'
    },
    {
      id: 20,
      level: 'medium',
      question: 'Which player is shown in this image?',
      option1: 'Cristiano Ronaldo',
      option2: 'Lionel Messi',
      option3: 'Neymar',
      option4: 'Kylian Mbappé',
      answer: 'Lionel Messi',
      image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Lionel_Messi_20180626.jpg'
    },
    {
      id: 21,
      level: 'difficult',
      question: 'Which stadium is this?',
      option1: 'Old Trafford',
      option2: 'Camp Nou',
      option3: 'Wembley',
      option4: 'San Siro',
      answer: 'Camp Nou',
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Camp_Nou_panorama.jpg'
    },
    {
      id: 22,
      level: 'normal',
      question: 'Which trophy is shown in the image?',
      option1: 'FA Cup',
      option2: 'FIFA World Cup',
      option3: 'UEFA Champions League',
      option4: 'Copa America',
      answer: 'FIFA World Cup',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/FIFA_World_Cup_Trophy_2018.png'
    },
    {
      id: 23,
      level: 'medium',
      question: 'Which country is this football kit from?',
      option1: 'Germany',
      option2: 'Spain',
      option3: 'England',
      option4: 'Italy',
      answer: 'Germany',
      image: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Germany_national_football_team_2018_world_cup_home_kit.png'
    },
    {
      id: 24,
      level: 'difficult',
      question: 'Which famous footballer is this (childhood photo)?',
      option1: 'Cristiano Ronaldo',
      option2: 'Ronaldinho',
      option3: 'David Beckham',
      option4: 'Zlatan Ibrahimović',
      answer: 'Ronaldinho',
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Ronaldinho_Gaucho_child.jpg'
    }
  ];
}
