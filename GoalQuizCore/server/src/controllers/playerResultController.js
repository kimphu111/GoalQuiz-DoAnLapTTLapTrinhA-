const asyncHandler = require("express-async-handler");
const PlayerResult = require("../models/playerResultModel");
const Quiz = require("../models/quizModel");
const User = require('../models/userModel');
const { fn, col, literal, Op } = require('sequelize');


// const models = {
//   Quiz: Quiz,
//   PlayerResult: PlayerResult
// };

// Object.keys(models).forEach(modelName => {
//   if (typeof models[modelName].associate === 'function') {
//     models[modelName].associate(models);
//   }
// });

//@desc postPlayerResult PlayerResult
//@route POST /api/play/postPlayerResult
//@access public
const postPlayerResult = asyncHandler(async (req, res) => {
  const { idQuestion, chooseAnswer, dateDoQuiz, quizLevel, dateFinishQuiz } = req.body;
  const userId = req.user.id;
  if (!idQuestion || !chooseAnswer || !dateDoQuiz || !quizLevel || !dateFinishQuiz) {
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
    dateFinishQuiz,
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
  const { level } = req.params;

  if (!['easy', 'medium', 'hard', 'mix'].includes(level)) {
    return res.status(400).json({ message: 'Invalid quiz level' });
  }

  try {
    const results = await PlayerResult.findAll({
      where: {
        quizLevel: level,
      },
      attributes: [
        'idUser',
        'dateDoQuiz',
        [fn('SUM', literal('CASE WHEN result = true THEN score ELSE 0 END')), 'quizScore']
      ],
      group: ['idUser', 'dateDoQuiz'],
      raw: true,
    });

    const bestScoresByUser = {};

    for (const r of results) {
      const { idUser, dateDoQuiz, quizScore } = r;

      if (!bestScoresByUser[idUser] || bestScoresByUser[idUser].quizScore < quizScore) {
        bestScoresByUser[idUser] = { idUser, dateDoQuiz, quizScore };
      }
    }

    const topUsersRaw = Object.values(bestScoresByUser)
      .sort((a, b) => b.quizScore - a.quizScore)
      .slice(0, 5);

    const userIds = topUsersRaw.map(u => u.idUser);
    const users = await User.findAll({
      where: { id: { [Op.in]: userIds } },
      attributes: ['id', 'username', 'email'],
    });

    const userMap = {};
    users.forEach(user => {
      userMap[user.id] = user;
    });

    const formattedTopUsers = await Promise.all(
      topUsersRaw.map(async item => {
        const quizRecord = await PlayerResult.findOne({
          where: {
            idUser: item.idUser,
            dateDoQuiz: item.dateDoQuiz,
            quizLevel: level
          },
          order: [['createdAt', 'DESC']],
          attributes: ['dateDoQuiz', 'dateFinishQuiz'],
          raw: true
        });

        let durationFormatted = 'N/A';
        if (quizRecord?.dateDoQuiz && quizRecord?.dateFinishQuiz) {
          const start = new Date(quizRecord.dateDoQuiz);
          const end = new Date(quizRecord.dateFinishQuiz);
          const diffMs = end - start;

          if (!isNaN(diffMs)) {
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
            durationFormatted = `${hours.toString().padStart(2, '0')}:${minutes
              .toString()
              .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          }
        }

        return {
          idUser: item.idUser,
          username: userMap[item.idUser]?.username || 'Unknown',
          email: userMap[item.idUser]?.email || 'Unknown',
          totalScore: item.quizScore,
          dateDoQuiz: item.dateDoQuiz,
          duration: durationFormatted,
        };
      })
    );

    res.status(200).json(formattedTopUsers);
  } catch (error) {
    console.error('Error fetching top users by best quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//@desc review  PlayerResult
//@route GET /api/play/review
//@access private
const review = asyncHandler(async (req, res) => {
  const { dateDoQuiz } = req.query;
  const idUser = req.user.id;
  
  if (!idUser || !dateDoQuiz) {
    return res.status(400).json({ message: 'Missing idUser or dateDoQuiz' });
  }

  const results = await PlayerResult.findAll({
    where: {
      idUser,
      dateDoQuiz
    },
    order: [['createdAt', 'ASC']],
     include: [
      {
        model: Quiz,
        attributes: ['question', 'image', 'correctAnswer', 'answerA', 'answerB', 'answerC', 'answerD']
      }
    ]
  });

  if (!results || results.length === 0) {
    return res.status(404).json({ message: 'No results found' });
  }

  const totalQuestions = results.length;
  const totalScore = results.reduce((sum, item) => {
    return item.result ? sum + item.score : sum;
  }, 0);

  res.status(200).json({
    totalQuestions,
    totalScore,
    results,
  });
});

//@desc getAllPlayerResult  PlayerResult
//@route GET /api/play/review
//@access public
const getAllPlayerResult = asyncHandler(async (req, res) => {
  const allResults = await PlayerResult.findAll({
    order: [['createdAt', 'ASC']],
    include: [
      {
        model: Quiz,
        attributes: ['question', 'image', 'correctAnswer', 'answerA', 'answerB', 'answerC', 'answerD']
      }
    ]
  })

  if (!allResults || allResults.length === 0) {
    return res.status(404).json({ message: 'No player results found' })
  }


  const groupedMap = allResults.reduce((map, item) => {
    const key = `${item.idUser}-${item.dateDoQuiz}`
    if (!map[key]) {
      map[key] = {
        idUser: item.idUser,
        dateDoQuiz: item.dateDoQuiz,
        totalQuestions: 0,
        totalScore: 0,
        results: []
      }
    }

    map[key].results.push(item)
    map[key].totalQuestions += 1
    if (item.result) {
      map[key].totalScore += item.score
    }

    return map
  }, {})

  const groupedArray = Object.values(groupedMap)

  res.status(200).json(groupedArray)
})

//@desc queryPlayerQuiz  PlayerResult
//@route POST /api/play/queryPlayerQuiz
//@access public
const queryPlayerQuiz = asyncHandler(async (req, res) => {
  const { idUser, dateDoQuiz } = req.body;

  if (!idUser || !dateDoQuiz) {
    return res.status(400).json({ message: 'Missing idUser or dateDoQuiz' });
  }

  console.log(idUser);
  console.log(dateDoQuiz);
  
  

  const results = await PlayerResult.findAll({
    where: {
      idUser,
      dateDoQuiz
    },
    order: [['createdAt', 'ASC']],
    include: [
      {
        model: Quiz,
        attributes: [
          'question',
          'image',
          'correctAnswer',
          'answerA',
          'answerB',
          'answerC',
          'answerD'
        ]
      },
       {
        model: User,
        attributes: ['username']
      }
    ]
  });

  if (!results || results.length === 0) {
    return res.status(404).json({ message: 'No results found for this user and date' });
  }

  const totalQuestions = results.length;
  const totalScore = results.reduce((sum, item) => {
    return item.result ? sum + item.score : sum;
  }, 0);

  res.status(200).json({
    idUser,
    dateDoQuiz,
    totalQuestions,
    totalScore,
    results
  });
});

module.exports = { postPlayerResult, getTopUsersByLevel, review, getAllPlayerResult, queryPlayerQuiz };
