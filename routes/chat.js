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


// 1.2 채팅방 선택 삭제 추가
/* 
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
router.post('/createChatRoom', (req, res) => {
  const chatRoomId = uuidv4();
  const chatRoomName = req.body.chatRoomName || `Chat Room ${chatRoomId()}`;
  const query = 'INSERT INTO conversations (id, title) VALUES (?, ?)';
  db.query(query, [chatRoomId, chatRoomName], (err) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ message: 'Database error' });
    } else {
      res.json({ chatRoomId });
    }
  });
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

// 채팅방 삭제 엔드포인트
router.delete('/deleteChatRoom', isAuthenticated, (req, res) => {
  const { roomId } = req.query;

  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).send('Error starting transaction');
    }

    const deleteMessagesQuery = 'DELETE FROM messages WHERE conversation_id = ?';
    const deleteParticipantsQuery = 'DELETE FROM participants WHERE conversation_id = ?';
    const deleteRoomQuery = 'DELETE FROM conversations WHERE id = ?';

    db.query(deleteMessagesQuery, [roomId], (err) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error deleting messages:', err);
          res.status(500).send('Error deleting messages');
        });
      }
      console.log(`Messages in room ${roomId} deleted`);

      db.query(deleteParticipantsQuery, [roomId], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error deleting participants:', err);
            res.status(500).send('Error deleting participants');
          });
        }
        console.log(`Participants in room ${roomId} deleted`);

        db.query(deleteRoomQuery, [roomId], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error deleting chat room:', err);
              res.status(500).send('Error deleting chat room');
            });
          }
          console.log(`Room ${roomId} deleted`);

          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                console.error('Error committing transaction:', err);
                res.status(500).send('Error committing transaction');
              });
            }
            console.log(`Transaction committed for room ${roomId}`);
            res.sendStatus(200);
          });
        });
      });
    });
  });
});

// 특정 사용자와의 대화방 확인 엔드포인트
router.get('/checkChatRoom', isAuthenticated, (req, res) => {
  const { userId, targetUserId } = req.query;
  if (!userId || !targetUserId) {
    return res.status(400).json({ message: 'userId and targetUserId are required' });
  }
  const checkRoomQuery = `
    SELECT c.id
    FROM conversations c
    JOIN participants p1 ON c.id = p1.conversation_id
    JOIN participants p2 ON c.id = p2.conversation_id
    WHERE p1.user_id = ? AND p2.user_id = ? AND p1.user_id != p2.user_id
  `;

  db.query(checkRoomQuery, [userId, targetUserId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length > 0) {
      return res.json({ chatRoomId: results[0].id });
    }
    return res.json({ chatRoomId: null });
  });
});

module.exports = router;
*/

// 1.1 채팅 목록 기능 추가
/*
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
router.post('/createChatRoom', (req, res) => {
  const chatRoomName = req.body.chatRoomName || `Chat Room ${uuidv4()}`;
  const query = 'INSERT INTO conversations (id, title) VALUES (?, ?)';
  db.query(query, [chatRoomName, chatRoomName], (err) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ message: 'Database error' });
    } else {
      res.json({ chatRoomId: chatRoomName });
    }
  });
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

// 메시지 삭제 엔드포인트
router.delete('/clearMessages', isAuthenticated, (req, res) => {
  const query = 'DELETE FROM messages';
  db.query(query, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.sendStatus(200);
  });
});

// 특정 사용자와의 대화방 확인 엔드포인트
router.get('/checkChatRoom', isAuthenticated, (req, res) => {
  const { userId, targetUserId } = req.query;
  if (!userId || !targetUserId) {
    return res.status(400).json({ message: 'userId and targetUserId are required' });
  }
  const checkRoomQuery = `
    SELECT c.id
    FROM conversations c
    JOIN participants p1 ON c.id = p1.conversation_id
    JOIN participants p2 ON c.id = p2.conversation_id
    WHERE p1.user_id = ? AND p2.user_id = ? AND p1.user_id != p2.user_id
  `;

  db.query(checkRoomQuery, [userId, targetUserId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length > 0) {
      return res.json({ chatRoomId: results[0].id });
    }
    return res.json({ chatRoomId: null });
  });

  


});

module.exports = router;
*/

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