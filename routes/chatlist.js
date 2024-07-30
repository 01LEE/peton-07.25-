
// 1.0 채팅 목록 기능 추가

const express = require('express');
const router = express.Router();
const db = require('../db');
const isAuthenticated = require('../middlewares/isAuthenticated');

// 채팅방 목록 페이지 렌더링
router.get('/chatlist', isAuthenticated, (req, res) => {
  res.render('chatlist');
});

// 채팅방 목록 제공 엔드포인트
router.get('/chatRooms', isAuthenticated, (req, res) => {
  const query = 'SELECT * FROM conversations';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ message: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
