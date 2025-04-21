const asyncHandler = require("express-async-handler");
const Quiz = require("../models/quizModel");
const { sequelize } = require("../databases/mysql/mysqlConnect");

//@desc getEasyQuiz User
//@route GET /api/quiz/getEasyQuiz
//@access public
const getEasyQuiz = asyncHandler(async (req, res) => {
  try {
    const easyQuizzes = await Quiz.findAll({
      where: {
        level: "easy",
      },
      order: sequelize.literal("RAND()"),
      limit: 10,
    });

    res.status(200).json({
      success: true,
      count: easyQuizzes.length,
      data: easyQuizzes,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error when get easy quiz");
  }
});

//@desc getEasyQuiz User
//@route GET /api/quiz/getMediumQuiz
//@access public
const getMediumQuiz = asyncHandler(async (req, res) => {
  try {
    const easyQuizzes = await Quiz.findAll({
      where: {
        level: "medium",
      },
      order: sequelize.literal("RAND()"),
      limit: 10,
    });

    res.status(200).json({
      success: true,
      count: easyQuizzes.length,
      data: easyQuizzes,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error when get medium quiz");
  }
});

//@desc getEasyQuiz User
//@route GET /api/quiz/getHardQuiz
//@access public
const getHardQuiz = asyncHandler(async (req, res) => {
  try {
    const easyQuizzes = await Quiz.findAll({
      where: {
        level: "hard",
      },
      order: sequelize.literal("RAND()"),
      limit: 10,
    });

    res.status(200).json({
      success: true,
      count: easyQuizzes.length,
      data: easyQuizzes,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error when get hard quiz");
  }
});

//@desc getEasyQuiz User
//@route GET /api/quiz/getMixQuiz
//@access public
const getMixQuiz = asyncHandler(async (req, res) => {
  try {
    const [easyQuizzes, mediumQuizzes, hardQuizzes] = await Promise.all([
      Quiz.findAll({
        where: { level: "easy" },
        order: sequelize.literal("RAND()"),
        limit: 5,
      }),
      Quiz.findAll({
        where: { level: "medium" },
        order: sequelize.literal("RAND()"),
        limit: 3,
      }),
      Quiz.findAll({
        where: { level: "hard" },
        order: sequelize.literal("RAND()"),
        limit: 2,
      }),
    ]);

    const mixedQuizzes = [...easyQuizzes, ...mediumQuizzes, ...hardQuizzes];

    const shuffledQuizzes = mixedQuizzes
      .map((q) => ({ q, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ q }) => q);

    res.status(200).json({
      success: true,
      count: shuffledQuizzes.length,
      data: shuffledQuizzes,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error when getting mixed quiz");
  }
});

module.exports = { getEasyQuiz, getMediumQuiz, getHardQuiz, getMixQuiz };
