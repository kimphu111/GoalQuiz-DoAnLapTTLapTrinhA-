const asyncHandler = require("express-async-handler");
const PlayerResult = require("../models/playerResultModel");
const Quiz = require("../models/quizModel");
const User = require('../models/userModel');
const { fn, col, literal } = require('sequelize');

//@desc postPlayerResult PlayerResult
//@route POST /api/play/postPlayerResult
//@access public
const postPlayerResult = asyncHandler(async (req, res) => {
  const { idQuestion, chooseAnswer, dateDoQuiz, quizLevel } = req.body;
  const userId = req.user.id;
  if (!idQuestion || !chooseAnswer || !dateDoQuiz || !quizLevel) {
    res.status(400);
    throw new Error("Need fill idQuestion and chooseAnswer!");
  }
  const question = await Quiz.findByPk(idQuestion);
  if (!question) {
    res.status(404);
    throw new Error("Question not found!");
  }
  const isCorrect = await question.correctAnswer === chooseAnswer;

  const result = await PlayerResult.create({
    idQuestion,
    idUser: userId,
    chooseAnswer,
    result: isCorrect,
    score: question.score,
    dateDoQuiz,
    quizLevel
  });

  res.status(201).json({
    result: result,
    message: "post successful",
  });
});

//@desc getTop5UsersByMode  PlayerResult
//@route GET /api/play/leaderboard/:level
//@access private
const getTopUsersByLevel = asyncHandler(async (req, res) => {
    const { level } = req.params; // "easy", "medium", "hard", "mix"
  
    if (!['easy', 'medium', 'hard', 'mix'].includes(level)) {
      return res.status(400).json({ message: 'Invalid quiz level' });
    }
  
    try {
      const topUsers = await PlayerResult.findAll({
        attributes: [
          'idUser',
          [fn('SUM', literal('CASE WHEN result = true THEN score ELSE 0 END')), 'totalScore']
        ],
        where: {
          quizLevel: level,
        },
        group: ['idUser'],
        order: [[literal('totalScore'), 'DESC']],
        limit: 5,
        include: [
          {
            model: User,
            attributes: ['email', 'username']
          }
        ]
      });
  
      res.status(200).json(topUsers);
    } catch (error) {
      console.error('Error fetching top users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = { postPlayerResult, getTopUsersByLevel };
