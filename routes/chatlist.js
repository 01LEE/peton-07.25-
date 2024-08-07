
// 1.1 채팅방 유저 이름 설정 채팅방 id 발신자_수신자로 설정

const express = require('express');
const router = express.Router();
const db = require('../db');
const isAuthenticated = require('../middlewares/isAuthenticated');

// 채팅방 목록 페이지 렌더링
// 1.2
router.get('/chatlist', isAuthenticated, (req, res) => {
  const userId = req.session.userid; // 세션에서 사용자 ID를 가져옵니다.

  const query = `
    SELECT c.id, p2.user_name as other_user_name
    FROM conversations c
    JOIN participants p1 ON c.id = p1.conversation_id AND p1.user_id = ?
    JOIN participants p2 ON c.id = p2.conversation_id AND p2.user_id != ?
  `;

  db.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // `chatRooms` 변수를 뷰로 전달합니다.
    res.render('chatlist', { chatRooms: results });
  });
});

/* 1.1
router.get('/chatlist', isAuthenticated, (req, res) => {
  res.render('chatlist');
});

// 채팅방 목록 제공 엔드포인트
// 1.2 ver
router.get('/chatRooms', isAuthenticated, (req, res) => {
  const userId = req.session.userid;
  const query = `
    SELECT c.id, p1.user_name as other_user_name
    FROM conversations c
    JOIN participants p1 ON c.id = p1.conversation_id AND p1.user_id != ?
    JOIN participants p2 ON c.id = p2.conversation_id AND p2.user_id = ?`;

  db.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});


// 1.1 ver

// router.get('/chatRooms', isAuthenticated, (req, res) => {
//   const query = 'SELECT * FROM conversations';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       res.status(500).json({ message: 'Database error' });
//     } else {
//       res.json(results);
//     }
//   });
// });

*/

// 채팅방 생성 
/* 
// // 채팅방 생성 또는 기존 채팅방으로 이동
// router.post('/createOrFindChatRoom', isAuthenticated, (req, res) => {
//   const { userId, targetUserId, targetUserName } = req.body;
//   const chatRoomId1 = `${userId}_${targetUserId}`;
//   const chatRoomId2 = `${targetUserId}_${userId}`;

//   // 기존 채팅방 확인 쿼리
//   const checkRoomQuery = 'SELECT * FROM conversations WHERE id = ?';

//   db.query(checkRoomQuery, [chatRoomId1, chatRoomId2], (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }
//     if (results.length > 0) {
//       // 기존 채팅방이 있는 경우
//       return res.json({ chatRoomId: results[0].id });
//     } else {
//       // 새로운 채팅방 생성
//       const chatRoomName = targetUserName;
//       const createRoomQuery = 'INSERT INTO conversations (id, title) VALUES (?, ?)';
//       const insertParticipantsQuery = 'INSERT INTO participants (conversation_id, user_id) VALUES (?, ?), (?, ?)';

//       db.query(createRoomQuery, [chatRoomId1, chatRoomName], (err) => {
//         if (err) {
//           console.error('Database query error:', err);
//           return res.status(500).json({ message: 'Database error' });
//         }
//         db.query(insertParticipantsQuery, [chatRoomId1, userId, chatRoomId1, targetUserId], (err) => {
//           if (err) {
//             console.error('Database query error:', err);
//             return res.status(500).json({ message: 'Database error' });
//           }
//           return res.json({ chatRoomId: chatRoomId1 });
//         });
//       });
//     }
//   });
// });
*/

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



// 1.0 채팅 목록 기능 추가
/*
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
*/