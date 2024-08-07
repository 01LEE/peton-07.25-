// routes/chat.js

// 1.3 오류 수정

const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const isAuthenticated = require('../middlewares/isAuthenticated');

// 개별 채팅방 페이지 렌더링
router.get('/chat', isAuthenticated, (req, res) => {
  res.render('chat');
});

// 메시지 로드 엔드포인트
router.get('/messages', isAuthenticated, (req, res) => {
  const { roomId } = req.query;
  const query = 'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp';
  db.query(query, [roomId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// 메시지 전송 엔드포인트
/*
router.post('/sendMessage', isAuthenticated, (req, res) => {
  const { roomId, sender, receiver, message } = req.body;
  const query = 'INSERT INTO messages (conversation_id, sender, receiver, message) VALUES (?, ?, ?, ?)';
  db.query(query, [roomId, sender, receiver, message], (err) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.sendStatus(200);
  });
});
*/

// 메시지 삭제 엔드포인트
router.delete('/clearMessages', isAuthenticated, (req, res) => {
  const { roomId } = req.query;
  const query = 'DELETE FROM messages WHERE conversation_id = ?';
  db.query(query, [roomId], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.sendStatus(200);
  });
});


module.exports = router;