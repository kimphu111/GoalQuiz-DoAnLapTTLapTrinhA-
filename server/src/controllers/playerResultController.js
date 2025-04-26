const asyncHandler = require("express-async-handler");
const PlayerResult = require("../models/playerResultModel");
const Quiz = require('../models/quizModel');

//@desc postPlayerResult PlayerResult
//@route POST /api/play/postPlayerResult
//@access public
const postPlayerResult = asyncHandler(async (req, res) => {
    const {idQuestion,chooseAnswer,dateDoQuiz} = req.body;
    const userId = req.user.id;
    if(!idQuestion||!chooseAnswer){
        res.status(400);
        throw new Error('Need fill idQuestion and chooseAnswer!');
    }
    const question = await Quiz.findByPk(idQuestion);
    if (!question) {
        res.status(404);
        throw new Error('Question not found!');
    }
    const isCorrect = await question.correctAnswer === chooseAnswer;
        
    const result =  await PlayerResult.create({
        idQuestion,
        idUser:userId,
        chooseAnswer,
        result: isCorrect,
        score:question.score,
        dateDoQuiz
    });
    
    res.status(201).json({
        result: result,
        message:"post successful"
    });
});

module.exports = { postPlayerResult };