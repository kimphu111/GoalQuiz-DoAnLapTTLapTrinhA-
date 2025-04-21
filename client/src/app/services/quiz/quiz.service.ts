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
      options: ['Paris', 'London', 'Brelin', 'Madris'],
      answer: 'Paris'
    },
    {
      id: 2,
      level: 'easy',
      question: 'Who won the FIFA World Cup in 2018?',
      options: ['Brazil', 'Germany', 'France', 'Argentina'],
      answer: 'France'
    },
    {
      id: 3,
      level: 'easy',
      question: 'What is the largest planet in our solar system?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      answer: 'Jupiter'
    },
    {
      id: 4,
      level: 'easy',
      question: 'Which programming language is used for Angular?',
      options: ['JavaScript', 'Python', 'TypeScript', 'Ruby'],
      answer: 'TypeScript'
    },
    {
      id: 5,
      level: 'normal',
      question: 'Which country hosted the 2014 FIFA World Cup?',
      options: ['Brazil', 'Russia', 'South Africa', 'Germany'],
      answer: 'Brazil'
    },
    {
      id: 6,
      level: 'normal',
      question: 'Who is known as the "King of Football"?',
      options: ['Maradona', 'Pele', 'Messi', 'Ronaldo'],
      answer: 'Pele'
    },
    {
      id: 7,
      level: 'normal',
      question: 'Which team won the UEFA Champions League in 2020?',
      options: ['Bayern Munich', 'PSG', 'Liverpool', 'Real Madrid'],
      answer: 'Bayern Munich'
    },
    {
      id: 8,
      level: 'normal',
      question: 'What is the regulation length of a football match?',
      options: ['80 minutes', '90 minutes', '100 minutes', '120 minutes'],
      answer: '90 minutes'
    },
    {
      id: 9,
      level: 'medium',
      question: 'Which player has won the most Ballon d\'Or awards?',
      options: ['Cristiano Ronaldo', 'Lionel Messi', 'Michel Platini', 'Johan Cruyff'],
      answer: 'Lionel Messi'
    },
    {
      id: 10,
      level: 'medium',
      question: 'Which country has won the most FIFA World Cups?',
      options: ['Germany', 'Italy', 'Brazil', 'Argentina'],
      answer: 'Brazil'
    },
    {
      id: 11,
      level: 'medium',
      question: 'Which club has the most UEFA Champions League titles?',
      options: ['AC Milan', 'Liverpool', 'Real Madrid', 'Barcelona'],
      answer: 'Real Madrid'
    },
    {
      id: 12,
      level: 'medium',
      question: 'Who scored the "Hand of God" goal?',
      options: ['Diego Maradona', 'Pele', 'Zinedine Zidane', 'David Beckham'],
      answer: 'Diego Maradona'
    },
    {
      id: 13,
      level: 'medium',
      question: 'Which country won the first ever FIFA World Cup?',
      options: ['Uruguay', 'Brazil', 'Italy', 'France'],
      answer: 'Uruguay'
    },
    {
      id: 14,
      level: 'difficult',
      question: 'Which club did Zinedine Zidane play for before joining Real Madrid?',
      options: ['Juventus', 'Bordeaux', 'Monaco', 'Marseille'],
      answer: 'Juventus'
    },
    {
      id: 15,
      level: 'difficult',
      question: 'Who is the all-time top scorer in the English Premier League?',
      options: ['Wayne Rooney', 'Alan Shearer', 'Thierry Henry', 'Sergio Agüero'],
      answer: 'Alan Shearer'
    },
    {
      id: 16,
      level: 'difficult',
      question: 'Which country won the UEFA Euro 2004?',
      options: ['Portugal', 'Greece', 'Spain', 'France'],
      answer: 'Greece'
    },
    {
      id: 17,
      level: 'difficult',
      question: 'Who was the captain of Spain when they won the 2010 FIFA World Cup?',
      options: ['Xavi', 'Iker Casillas', 'Sergio Ramos', 'Andres Iniesta'],
      answer: 'Iker Casillas'
    },
    {
      id: 18,
      level: 'difficult',
      question: 'Which African country reached the quarter-finals of the 1990 FIFA World Cup?',
      options: ['Nigeria', 'Cameroon', 'Ghana', 'Senegal'],
      answer: 'Cameroon'
    }

  ];
}
