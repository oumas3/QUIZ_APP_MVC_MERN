const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Assuming you have a User model for students that includes a 'filiere' field.
// const User = require('./user');

const StudentQuizSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: String,
    required: true
  },
  dateTaken: {
    type: Date,
    default: Date.now
  }
  // You can add more fields if necessary, like a field for correct/incorrect answers, etc.
});

module.exports = mongoose.model('StudentQuiz', StudentQuizSchema);
