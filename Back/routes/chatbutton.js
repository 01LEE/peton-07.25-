const express = require('express');
const router = express.Router();
const db = require('../db');  // 데이터베이스 연결을 위한 모듈
const isAuthenticated = require('../middlewares/isAuthenticated');

// 사용자 정보 가져오기
router.get('/getCurrentUser', (req, res) => {
  if (req.session && req.session.userid && req.session.login_id) {
    console.log(`사용자 세션 정보 - UserID: ${req.session.userid}, LoginID: ${req.session.login_id}`);


    const query = 'SELECT nick_name FROM user WHERE user_id = ?';
    db.query(query, [req.session.userid], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        console.log(`DB 조회 결과 - Nickname: ${results[0].nick_name}`);


        res.json({ 
          user_id: req.session.userid, 
          login_id: req.session.login_id,
          nick_name: results[0].nick_name, // nick_name 추가
          sender: req.session.login_id, 
        });
      } else {
        console.error(`User not found - UserID: ${req.session.userid}`);
        res.status(404).json({ error: 'User not found' });
      }
    });
  } else {
    console.error('User not authenticated');
    res.status(401).json({ error: 'User not authenticated' });
  }
});

// 모든 사용자의 정보를 반환하는 API
router.get('/users-all', (req, res) => {
  const userId = req.session.userid; // 세션에서 사용자 ID 가져오기

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const query = 'SELECT user_id, login_id, nick_name FROM user';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);  // 모든 유저의 user_id, login_id, nick_name 반환
  });
});

// 채팅방 생성 또는 기존 채팅방으로 이동
router.post('/createOrFindChatRoom', isAuthenticated, (req, res) => {
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

// 채팅방 목록 API 엔드포인트
router.get('/chatlist', isAuthenticated, (req, res) => {
  const userId = req.session.userid;

  const query = `
    SELECT c.id, 
           u.nick_name as other_user_name, 
           u.user_id as other_user_id
    FROM conversations c
    JOIN participants p1 ON c.id = p1.conversation_id AND p1.user_id = ?
    JOIN participants p2 ON c.id = p2.conversation_id AND p2.user_id != ?
    JOIN user u ON p2.user_id = u.user_id
  `;

  db.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      console.log('No chat rooms found for user:', userId);
      return res.json([]);  // 빈 배열 반환
    }
    
    console.log('Query Results:', results);
    
    const chatRooms = results.map((row) => {
      return {
        id: row.id,
        other_user: {
          user_id: row.other_user_id,
          nick_name: row.other_user_name
        }
      };
    });

    res.json(chatRooms);
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


module.exports = router;
