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
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      answer: 'Paris',
      url: 'https://example.com/images/france.jpg' // Example image URL
    },
    {
      id: 2,
      level: 'easy',
      question: 'Who won the FIFA World Cup in 2018?',
      options: ['Brazil', 'Germany', 'France', 'Argentina'],
      answer: 'France',
      url: 'https://example.com/images/worldcup2018.jpg' // Example image URL
    },
    {
      id: 3,
      level: 'easy',
      question: 'What is the largest planet in our solar system?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      answer: 'Jupiter',
      url: '' // No image for this question
    },
    {
      id: 4,
      level: 'easy',
      question: 'Which programming language is used for Angular?',
      options: ['JavaScript', 'Python', 'TypeScript', 'Ruby'],
      answer: 'TypeScript',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA' // Example image URL
    },
    {
      id: 5,
      level: 'normal',
      question: 'Which country hosted the 2014 FIFA World Cup?',
      options: ['Brazil', 'Russia', 'South Africa', 'Germany'],
      answer: 'Brazil',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA' // Example image URL
    },
    // Add `url` to other questions as needed
    {
      id: 6,
      level: 'normal',
      question: 'Who is known as the "King of Football"?',
      options: ['Maradona', 'Pele', 'Messi', 'Ronaldo'],
      answer: 'Pele',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA'
    },
    {
      id: 7,
      level: 'normal',
      question: 'Which team won the UEFA Champions League in 2020?',
      options: ['Bayern Munich', 'PSG', 'Liverpool', 'Real Madrid'],
      answer: 'Bayern Munich',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA'
    },
    {
      id: 8,
      level: 'normal',
      question: 'What is the regulation length of a football match?',
      options: ['80 minutes', '90 minutes', '100 minutes', '120 minutes'],
      answer: '90 minutes',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA'
    },
    {
      id: 9,
      level: 'medium',
      question: 'Which player has won the most Ballon d\'Or awards?',
      options: ['Cristiano Ronaldo', 'Lionel Messi', 'Michel Platini', 'Johan Cruyff'],
      answer: 'Lionel Messi',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA'
    },
    {
      id: 10,
      level: 'medium',
      question: 'Which country has won the most FIFA World Cups?',
      options: ['Germany', 'Italy', 'Brazil', 'Argentina'],
      answer: 'Brazil',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA'
    },
    {
      id: 11,
      level: 'medium',
      question: 'Which club has the most UEFA Champions League titles?',
      options: ['AC Milan', 'Liverpool', 'Real Madrid', 'Barcelona'],
      answer: 'Real Madrid',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA'
    },
    {
      id: 12,
      level: 'medium',
      question: 'Who scored the "Hand of God" goal?',
      options: ['Diego Maradona', 'Pele', 'Zinedine Zidane', 'David Beckham'],
      answer: 'Diego Maradona',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA'
    },
    {
      id: 13,
      level: 'medium',
      question: 'Which country won the first ever FIFA World Cup?',
      options: ['Uruguay', 'Brazil', 'Italy', 'France'],
      answer: 'Uruguay',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA'
    },
    {
      id: 14,
      level: 'difficult',
      question: 'Which club did Zinedine Zidane play for before joining Real Madrid?',
      options: ['Juventus', 'Bordeaux', 'Monaco', 'Marseille'],
      answer: 'Juventus',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA'
    },
    {
      id: 15,
      level: 'difficult',
      question: 'Who is the all-time top scorer in the English Premier League?',
      options: ['Wayne Rooney', 'Alan Shearer', 'Thierry Henry', 'Sergio Agüero'],
      answer: 'Alan Shearer',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA'
    },
    {
      id: 16,
      level: 'difficult',
      question: 'Which country won the UEFA Euro 2004?',
      options: ['Portugal', 'Greece', 'Spain', 'France'],
      answer: 'Greece',
      url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn70HCLUxXRXwapX56ttPBSWBd-0rr1l6IFGbg08IIhW2C6X12lO9iJacpeEjaDQjWON5SkVIUk8-ZVcJVYEuXARoCoMyzYzCd0KueqA'
    },
    {
      id: 17,
      level: 'difficult',
      question: 'Who was the captain of Spain when they won the 2010 FIFA World Cup?',
      options: ['Xavi', 'Iker Casillas', 'Sergio Ramos', 'Andres Iniesta'],
      answer: 'Iker Casillas',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbF_Bde_35mjAKlv7vj_HNVxFYcb1oM5U-HQ&s'
    },
    {
      id: 18,
      level: 'difficult',
      question: 'Which African country reached the quarter-finals of the 1990 FIFA World Cup?',
      options: ['Nigeria', 'Cameroon', 'Ghana', 'Senegal'],
      answer: 'Cameroon',
      url: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRwBoCZ4khB2aFsVrqWyJ4smAbjTKs_PLvOt0yXE35YBcl4BOn-J9qi91efeO9frEjpt0syTbmAdgF0iF4GwLX3v1yWi-L2z6uESFbHug'
    }
  ];
}
