const QuizModel = require('../models/quiz');

const getQuizzesByProfessor = async (req, res) => {
  let id = req.params.id;
  let role = req.headers['role'];
  let idtok = req.headers['id'];
  idtok = idtok.replace(/^"(.*)"$/, '$1');
  role = role.replace(/^"(.*)"$/, '$1');
  if(idtok != id){
    console.log(idtok)
    id = idtok;
    console.log("✔✔✔✨✨✨✨")
    res.status(401).json({ status: 'error', error: 'not same id', id: id });
    return;
  }
  try {
    let user = await UserModel.findOne({ _id: id });
    if (role != 'prof') {
      console.log(role)
      res.status(402).json({ status: 'error', error: 'not prof' });
      return;
    }
    let quizzes = await QuizModel.find({ createdby: id });
    quizzes = JSON.parse(JSON.stringify(quizzes));
    if (quizzes.length > 0) {
      res.status(200).json({ quizs: quizzes });
    } else {
      res.status(404).json({ status: 'error', error: 'No quizzes found' });
    }
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
};

const addQuiz = async (req, res) => {
  try {
    const quiz = await QuizModel.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
};

const deleteQuiz = async (req, res) => {
  let quizId = req.params.quizId;
  try {
    const quiz = await QuizModel.findByIdAndDelete(quizId);
    if (quiz) {
      res.status(200).json({ status: 'success', message: `Quiz deleted successfully: ${quizId}` });
    } else {
      res.status(404).json({ status: 'error', error: 'Quiz not found' });
    }
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
};

const getQuiz = async (req, res) => {
  let quizId = req.params.quizId;
  try {
    const quiz = await QuizModel.findById(quizId);
    if (quiz) {
      res.status(200).json(quiz);
    } else {
      res.status(404).json({ status: 'error', error: 'Quiz not found' });
    }
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
};

const updateQuiz = async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const quiz = await QuizModel.findByIdAndUpdate(quizId, req.body, { new: true });
    if (quiz) {
      res.status(200).json(quiz);
    } else {
      res.status(404).json({ status: 'error', error: 'Quiz not found' });
    }
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
};

module.exports = { getQuizzesByProfessor, addQuiz, deleteQuiz, getQuiz, updateQuiz };
