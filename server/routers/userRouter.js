const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/signin', UserController.signIn);
router.get('/checksession', UserController.checkSession);

module.exports = router;
