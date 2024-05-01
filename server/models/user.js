const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const valideRole = ['prof', 'student'];
const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true},
    role: {type: String, required: true, enum: valideRole},
    filiere: {
        filiere: { type: String, required: function () { return this.role === 'student'; } }
    }
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);

module.exports = User;