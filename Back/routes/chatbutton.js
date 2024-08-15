const express = require('express');
const router = express.Router();
const db = require('../db');  // 데이터베이스 연결을 위한 모듈

// 로그인한 사용자의 닉네임을 반환하는 API
router.get('/username', (req, res) => {
  const userId = req.session.userid; // 세션에서 사용자 ID 가져오기

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const query = 'SELECT nick_name FROM user WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ nick_name: results[0].nick_name });
  });
});

// 로그인한 사용자를 제외한 모든 사용자를 반환하는 API
router.get('/users-all', (req, res) => {
  const userId = req.session.userid; // 세션에서 사용자 ID 가져오기

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const query = 'SELECT user_id, nick_name FROM user WHERE user_id != ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);  // 다른 모든 사용자 반환
  });
});

module.exports = router;
