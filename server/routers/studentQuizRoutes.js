const express = require('express');
const router = express.Router();
const StudentQuizController = require('../controllers/StudentQuizController');

router.post('/api/quizzes/:quizId/submit', StudentQuizController.submitQuiz);
router.get('/api/student-quizzes/:studentId', StudentQuizController.getStudentQuizzes);

module.exports = router;
