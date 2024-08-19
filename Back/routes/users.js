// routes/users.js
// 1.1 리팩토링 및 소켓 기능 추가 0809 안정화 완

const express = require('express');
const router = express.Router();

// const { io } = require('../server'); // io 객체를 server.js에서 가져옴
const db = require('../db');
const isAuthenticated = require('../middlewares/isAuthenticated');
const activeUsersService = require('../services/activeUsersService');

// 활성 사용자 목록을 반환하는 엔드포인트
router.get('/active-users', isAuthenticated, (req, res) => {
  activeUsersService.getActiveUsers((err, users) => {
    if (err) {
      // 에러 발생 시 로그 기록
      console.error("Error fetching active users:", err);
      return res.status(500).json({ message: 'Database query error' });
    }
    res.json(users);
  });
});

// 사용자 목록 페이지 렌더링
router.get('/users', isAuthenticated, (req, res) => {

  // 라우트 접근 확인 로그
  console.log("Users route accessed");
 // 세션 정보 로그
 console.log("Session info:", req.session);


  activeUsersService.getActiveUsers((err, users) => {
    if (err) {

      // 에러 발생 시 로그 기록
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    // 성공적으로 사용자 목록을 가져온 경우 로그
    console.log("Users retrieved:", users);
    res.render('users', { users });
  });
});

// 채팅방 생성 또는 기존 채팅방으로 이동
/*
  router.post('/createOrFindChatRoom', isAuthenticated, (req, res) => {

  // 라우트 접근 확인 로그
  console.log("Create or Find Chat Room route accessed");
  // 요청 본문 데이터 로그
  console.log("Request body:", req.body);

  const { userId, targetUserId, targetUserName } = req.body;
  const chatRoomId1 = `${userId}_${targetUserId}`;
  const chatRoomId2 = `${targetUserId}_${userId}`;


  // 기존 채팅방 확인 쿼리 로그
  console.log("Checking for existing chat rooms with IDs:", chatRoomId1, chatRoomId2);


  // 기존 채팅방 확인 쿼리
  const checkRoomQuery = 'SELECT * FROM conversations WHERE id = ? OR id = ?';

  db.query(checkRoomQuery, [chatRoomId1, chatRoomId2], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length > 0) {
      // 기존 채팅방이 있는 경우
      console.log('기존 채팅방으로 이동:', results[0].id);
      return res.json({ chatRoomId: results[0].id });
    } else {
      // 새로운 채팅방 생성
      const chatRoomName = targetUserName;
      const createRoomQuery = 'INSERT INTO conversations (id, title) VALUES (?, ?)';
      const insertParticipantsQuery = 'INSERT INTO participants (conversation_id, user_id, user_name) VALUES (?, ?, ?), (?, ?, ?)';
      const { io } = require('../server');
      db.query(createRoomQuery, [chatRoomId1, chatRoomName], (err) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ message: 'Database error' });
        }
        db.query(insertParticipantsQuery, [chatRoomId1, userId, req.session.login_id, chatRoomId1, targetUserId, targetUserName], (err) => {
          if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error' });
          }
          console.log('새 채팅방 생성 및 이동:', chatRoomId1);
          // io.emit('refreshChatList', { userId, targetUserId }); // Socket.IO 이벤트 발생
          return res.json({ chatRoomId: chatRoomId1 });
        });
      });
    }
  });
  });
*/


module.exports = router;



// 1.0 안정화 버전 0808 pm 09:42
/*
const express = require('express');
const router = express.Router();
const db = require('../db');
const isAuthenticated = require('../middlewares/isAuthenticated');
const activeUsersService = require('../services/activeUsersService');

// 활성 사용자 목록을 반환하는 엔드포인트
router.get('/active-users', isAuthenticated, (req, res) => {
  activeUsersService.getActiveUsers((err, users) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error' });
    }
    res.json(users);
  });
});

// 사용자 목록 페이지 렌더링
router.get('/users', isAuthenticated, (req, res) => {
  activeUsersService.getActiveUsers((err, users) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.render('users', { users });
  });
});





// 채팅방 생성 또는 기존 채팅방으로 이동
router.post('/createOrFindChatRoom', isAuthenticated, (req, res) => {
  const { userId, targetUserId, targetUserName } = req.body;
  const chatRoomId1 = `${userId}_${targetUserId}`;
  const chatRoomId2 = `${targetUserId}_${userId}`;

  // 기존 채팅방 확인 쿼리
  const checkRoomQuery = 'SELECT * FROM conversations WHERE id = ? OR id = ?';

  db.query(checkRoomQuery, [chatRoomId1, chatRoomId2], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length > 0) {
      // 기존 채팅방이 있는 경우
      return res.json({ chatRoomId: results[0].id });
    } else {
      // 새로운 채팅방 생성
      const chatRoomName = targetUserName;
      const createRoomQuery = 'INSERT INTO conversations (id, title) VALUES (?, ?)';
      const insertParticipantsQuery = 'INSERT INTO participants (conversation_id, user_id, user_name) VALUES (?, ?, ?), (?, ?, ?)';

      db.query(createRoomQuery, [chatRoomId1, chatRoomName], (err) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ message: 'Database error' });
        }
        db.query(insertParticipantsQuery, [chatRoomId1, userId, req.session.login_id, chatRoomId1, targetUserId, targetUserName], (err) => {
          if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error' });
          }
          //io.emit('refreshChatList', { userId, targetUserId }); // 추가
          return res.json({ chatRoomId: chatRoomId1 });
        });
      });
    }
  });
});

module.exports = router;
*/