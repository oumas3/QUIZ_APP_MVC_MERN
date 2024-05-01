const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuizSchema = new Schema({
    title: {type: String, required: true},
    questions: [{
        question: {type: String, required: true},
        answers: [{
            answer: {type: String, required: true},
            isCorrect: {type: Boolean, required: true}
        }]
    }],
    startDate: {type: Date, required: true},
    expirationDate: {type: Date, required: true},
    filiere: {type: String, required: true},
    createdby: {type: String, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);