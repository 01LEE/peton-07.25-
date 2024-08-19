 // 1.1 리팩토리후 소켓 기능 추가 0809 안정화 완

const express = require('express');
const router = express.Router();

// const { io } = require('../server'); // io 객체를 server.js에서 가져옴
const db = require('../db');
const isAuthenticated = require('../middlewares/isAuthenticated');
const activeUsersService = require('../services/activeUsersService');

// 개별 채팅방 페이지 렌더링
router.get('/chat', isAuthenticated, (req, res) => {
  res.render('chat');
});

// 메시지 로드 엔드포인트
/*
router.get('/messages', isAuthenticated, (req, res) => {
  const { roomId } = req.query;

  console.log(`메시지 로드 요청 - Room ID: ${roomId}`);

  const query = `
    SELECT m.id, m.conversation_id, m.sender, m.receiver, m.message, m.timestamp, 
           u1.nick_name AS senderNickname
    FROM messages m
    JOIN user u1 ON m.sender = u1.login_id
    WHERE m.conversation_id = ?
    ORDER BY m.timestamp ASC`;

  db.query(query, [roomId], (err, results) => {
    if (err) {
      console.error('메시지 로드 중 오류 발생:', err);
      return res.status(500).json({ error: '메시지 로드 중 오류 발생' });
    }

    // 메시지 쿼리 결과 로그 출력
    console.log(`로드된 메시지 결과 - Room ID: ${roomId}`, results);
    
    res.json(results);
  });
});
*/

// 메시지 삭제 엔드포인트
/*
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
*/

module.exports = router;
