const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sorasorasoraaaa@@2145';

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email, password });
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
};

const checkSession = (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ status: 'error', error: 'Unauthorized' });
  }
};

module.exports = { signIn, checkSession };
