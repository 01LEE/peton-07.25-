// routes/chat.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/chat', isAuthenticated, (req, res) => {
  res.render('chat');
});

module.exports = router;
