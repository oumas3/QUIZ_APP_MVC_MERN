const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/QuizController');

router.get('/prof/:id/quiz', QuizController.getQuizzesByProfessor);
router.post('/prof/:id/addquiz', QuizController.addQuiz);
router.delete('/prof/:id/deletequiz/:quizId', QuizController.deleteQuiz);
router.get('/:quizId', QuizController.getQuiz);
router.put('/:quizId', QuizController.updateQuiz);

module.exports = router;
