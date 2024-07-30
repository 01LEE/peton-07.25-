// routes/chat.js

// 1.1 채팅 목록 기능 추가

const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const isAuthenticated = require('../middlewares/isAuthenticated');

// 개별 채팅방 페이지 렌더링
router.get('/chat', isAuthenticated, (req, res) => {
  res.render('chat');
});

// 채팅방 생성 엔드포인트
router.get('/createChatRoom', isAuthenticated, (req, res) => {
  const chatRoomId = uuidv4();
  const query = 'INSERT INTO conversations (id, title) VALUES (?, ?)';
  db.query(query, [chatRoomId, `Chat Room ${chatRoomId}`], (err) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ message: 'Database error' });
    } else {
      res.json({ chatRoomId });
    }
  });
});

// 메시지 가져오기
router.get('/messages', isAuthenticated, (req, res) => {
  const { roomId } = req.query;
  const query = 'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp';
  db.query(query, [roomId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// 메시지 삭제
router.delete('/clearMessages', isAuthenticated, (req, res) => {
  const query = 'DELETE FROM messages';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;


// 1.0
/*
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/chat', isAuthenticated, (req, res) => {
  res.render('chat');
});

module.exports = router;
*/