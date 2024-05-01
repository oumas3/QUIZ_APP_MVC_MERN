const StudentQuiz = require('../models/StudentQuizSchema');
const QuizModel = require('../models/quiz');

const recordStudentQuiz = async (studentId, quizId, score) => {
  const studentQuiz = new StudentQuiz({
    student: studentId,
    quiz: quizId,
    score: score
  });
  try {
    await studentQuiz.save();
    console.log('Student quiz record saved successfully.');
  } catch (error) {
    console.error('Error saving student quiz record:', error);
  }
};

const submitQuiz = async (req, res) => {
  try {
    let studentId = req.headers['id']; 
    studentId = studentId.replace(/^"(.*)"$/, '$1');
    const quizId = req.params.quizId;
    const submittedAnswers = req.body.answers; // { questionId: answerId, ... }
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    let score = 0;
    quiz.questions.forEach(question => {
      const correctAnswer = question.answers.find(answer => answer.isCorrect);
      const submittedAnswer = submittedAnswers[question._id.toString()];
      if (correctAnswer && submittedAnswer === correctAnswer._id.toString()) {
        score += 1;
      }
    });
    const totalQuestions = quiz.questions.length;
    const scoreString = `${score}/${totalQuestions}`;
    let studentQuizRecord = await StudentQuiz.findOne({ student: studentId, quiz: quizId });
    if (studentQuizRecord) {
      studentQuizRecord.score = scoreString;
      await studentQuizRecord.save();
    } else {
      studentQuizRecord = new StudentQuiz({
        student: studentId,
        quiz: quizId,
        score: scoreString
      });
      await studentQuizRecord.save();
    }
    res.json({ score: studentQuizRecord.score });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const getStudentQuizzes = async (req, res) => {
  try {
    const { studentId } = req.params;
    const quizAttempts = await StudentQuiz.find({ student: studentId }).populate('quiz');
    res.json(quizAttempts);
  } catch (error) {
    console.error('Failed to fetch student quizzes:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { recordStudentQuiz, submitQuiz, getStudentQuizzes };
