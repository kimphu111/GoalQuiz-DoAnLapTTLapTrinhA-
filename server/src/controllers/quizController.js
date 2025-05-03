const asyncHandler = require("express-async-handler");
const Quiz = require("../models/quizModel");
const { sequelize } = require("../databases/mysql/mysqlConnect");
const { Op } = require('sequelize');
const cloudinary = require('../cloudinary/cloudinaryConnect');
const fs = require('fs');

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

//@desc searchQuizByQuestionAndAnswer Admin
//@route GET /api/quiz/searchQuizByQuestionAndAnswer?search=Ronaldo
//@access private

const searchQuizByQuestionAndAnswer = asyncHandler(async (req,res)=>{
  var {keyword} = req.query;
  
  if (!keyword || keyword.trim() === '') {
    return res.status(400).json({ message: 'Keyword is required' });
  }

  const search = keyword.trim().toLowerCase();

  const quizzes = await Quiz.findAll({
    where: {
      [Op.or]: [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('question')), {
          [Op.like]: `%${search}%`,
        }),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('answerA')), {
          [Op.like]: `%${search}%`,
        }),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('answerB')), {
          [Op.like]: `%${search}%`,
        }),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('answerC')), {
          [Op.like]: `%${search}%`,
        }),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('answerD')), {
          [Op.like]: `%${search}%`,
        }),
      ],
    },
  });


  res.status(200).json(quizzes);
})

//@desc postQuiz Quiz (Admin only)
//@route GET /api/quiz/postQuiz
//@access private
const postQuiz = asyncHandler(async (req,res) => {
  const quizInformation = JSON.parse(req.body.quizInformation);
  let imageUrl = null;
  if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'goalquiz',
        });
        imageUrl = result.secure_url;
  
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500);
        throw new Error('Image upload failed');
      }
    }

  try {
    const newQuiz = await Quiz.create({
      level: quizInformation.level,
      question: quizInformation.question,
      answerA: quizInformation.answerA,
      answerB: quizInformation.answerB,
      answerC: quizInformation.answerC,
      answerD: quizInformation.answerD,
      correctAnswer: quizInformation.correctAnswer,
      score: quizInformation.level === 'easy' ? 10 :
      quizInformation.level === 'medium' ? 20 :
      quizInformation.level === 'hard' ? 30 :
      10,
      image: imageUrl,
    });
  
    res.status(201).json({
      message: 'Quiz created successfully',
      quiz: newQuiz,
    });
  } catch (error) {
    console.error('Quiz creation error:', error);
    res.status(500);
    throw new Error('Database insert failed');
  }
});

module.exports = { getEasyQuiz, getMediumQuiz, getHardQuiz, getMixQuiz, searchQuizByQuestionAndAnswer, postQuiz };