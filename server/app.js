// Core module imports
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const StudentQuiz = require('./models/StudentQuizSchema');

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

// Model imports
const UserModel = require('./models/user');
const QuizModel = require('./models/quiz');

// Configuration (Consider moving this to a separate config file or environment variables)
const PORT = 5000;
const DB_URI = "mongodb+srv://Sora_Co:2002sora@webquiz.mfnv6fi.mongodb.net/QUIZ_Web"; // Place your MongoDB URI here
const JWT_SECRET = 'sorasorasoraaaa@@2145'; // Place your JWT secret here
const SESSION_SECRET = 'sorasorasoraaa@@2145'; // Place your session secret here

// Create an Express app
const app = express();

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === "production"
  }
}));

// Enable CORS with specific options
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Parse JSON requests
app.use(express.json());

// Connect to MongoDB and start the server
mongoose.connect(DB_URI)
  .then(() => app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  }))
  .catch(err => console.log(err));

// Middleware to validate JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        req.session.destroy();
        return res.sendStatus(403);
      }

      req.user = user;
      req.session.user = user;
      next();
    });
  } else {
    req.session.destroy();
    res.sendStatus(401);
  }
};

// Route for user sign in
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email, password });
    console.log(user.role)
    if (user) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ user: user, token: token });
    } else {
      res.status(401).json({ status: 'error', error: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error during sign in:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});

// Route to check session
app.get('/checksession', authenticateJWT, (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ status: 'error', error: 'Unauthorized' });
  }
});

// Route to get quizzes created by a specific professor
app.get('/prof/:id/quiz', async (req, res) => {
  let id = req.params.id;
  let role = req.headers['role'];
  let idtok = req.headers['id'];
  idtok = idtok.replace(/^"(.*)"$/, '$1');
  role = role.replace(/^"(.*)"$/, '$1');
  if(idtok != id){
    console.log(idtok)
    id = idtok;
    console.log("✔✔✔✨✨✨✨")
    res.status(401).json({ status: 'error', error: 'not same id', id: id });;
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
});

// Route to add a quiz
app.post('/prof/:id/addquiz', async (req, res) => {
  try {
    const quiz = await QuizModel.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});

// Route to delete a quiz
app.delete('/prof/:id/deletequiz/:quizId', async (req, res) => {
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
});

// Route to get a specific quiz
app.get('/:quizId', async (req, res) => {
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
});

// Route to update a quiz
app.put('/:quizId', async (req, res) => {
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
});

// Start listening for requests
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


app.get('/api/quizzes/:id' , async (req, res) => {
  const id = req.params.id;

  try {
    console.log(id)
   const user = await UserModel.findOne({ _id: id });
   const quizzes = await QuizModel.find({ filiere: { $regex: new RegExp(user.filiere, "i") } });
   console.log(quizzes)
    res.status(200).json({quizzes: quizzes});
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
})

app.get('/api/quizzes/take/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const quiz = await QuizModel.findOne({_id: id});
    console.log(quiz)
    res.status(200).json({ quiz: quiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
})





app.post('/api/quizzes/:quizId/submit', async (req, res) => {
  try {
    let studentId = req.headers['id']; 
    studentId = studentId.replace(/^"(.*)"$/, '$1');

    const quizId = req.params.quizId;
    const submittedAnswers = req.body.answers; // { questionId: answerId, ... }

    // Fetch the quiz from the database
    const quiz = await QuizModel.findById(quizId);

    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    let score = 0;
    
    // Loop through the questions to calculate the score
    quiz.questions.forEach(question => {
      const correctAnswer = question.answers.find(answer => answer.isCorrect);
      const submittedAnswer = submittedAnswers[question._id.toString()];

      if (correctAnswer && submittedAnswer === correctAnswer._id.toString()) {
        score += 1; // Increment score for each correct answer
      }
    });

    const totalQuestions = quiz.questions.length;
    const scoreString = `${score}/${totalQuestions}`; // Or any other format you prefer
    
    // Check if a record already exists
    let studentQuizRecord = await StudentQuiz.findOne({ student: studentId, quiz: quizId });

    if (studentQuizRecord) {
      // Update the existing record if one exists
      studentQuizRecord.score = scoreString;
      await studentQuizRecord.save();
    } else {
      // Otherwise, create a new record
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
});

app.get('/api/student-quizzes/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch all quiz attempts by this student
    const quizAttempts = await StudentQuiz.find({ student: studentId }).populate('quiz');

    // If you just need the quiz ID and the score, you can select specific fields
    // const quizAttempts = await StudentQuiz.find({ student: studentId }, 'quiz score');

    res.json(quizAttempts);
  } catch (error) {
    console.error('Failed to fetch student quizzes:', error);
    res.status(500).send('Internal Server Error');
  }
});