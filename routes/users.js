// routes/users.js

// 1.2 채팅방 생성시 자동 새로고침
/*
const express = require('express');
const router = express.Router();
const db = require('../db');
const isAuthenticated = require('../middlewares/isAuthenticated');
const activeUsersService = require('../services/activeUsersService');

module.exports = (io) => {
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
            io.emit('refreshChatList', { userId, targetUserId }); // 추가
            return res.json({ chatRoomId: chatRoomId1 });
          });
        });
      }
    });
  });

  return router;
};
*/

// 1.1

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
          io.emit('refreshChatList', { userId, targetUserId }); // 추가
          return res.json({ chatRoomId: chatRoomId1 });
        });
      });
    }
  });
});

module.exports = router;


// 1.0
/*
const express = require('express');
const router = express.Router();
const db = require('../db'); // DB 연결 설정
const activeUsersService = require('../services/activeUsersService');
const isAuthenticated = require('../middlewares/isAuthenticated');

// 활성 사용자 목록을 반환하는 엔드포인트
router.get('/active-users', (req, res) => {
  activeUsersService.getActiveUsers((err, users) => {
    if (err) {
      return res. status(500).json({ message: 'Database query error' });
    }
    res.json(users);
  });
});

// 사용자 페이지 렌더링 엔드포인트
router.get('/users', (req, res) => {
  res.render('users');
});

module.exports = router;
*/
