// 1.1 소켓 기능 추가 0809 안정화 완

// 1. 모듈 가져오기 및 초기 설정

  const socketSetup = (server, sessionMiddleware) => {
  const io = require('socket.io')(server);
  const activeUsers = new Set();
  const db = require('./db');

  // Socket.IO와 세션 미들웨어 통합
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });
  
  // 2. 클라이언트 연결 처리
  io.on('connection', (socket) => {
    console.log('New client connected');

    // 3. 사용자 등록 및 연결
    socket.on('register', (data) => {
      const { userId } = data;
      socket.userId = userId;
      activeUsers.add(userId);
      socket.join(userId);
      io.emit('activeUsers', Array.from(activeUsers));
    });

    // 4. 채팅방 입장
    socket.on('joinRoom', (roomId) => {
      if (!roomId) {
        console.error('roomId가 정의되지 않았습니다.');
        return;
      }

      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // 5. 메시지 전송
    socket.on('sendMessage', (data) => {
      console.log('서버에서 수신한 메시지:', data);
    
      const { roomId, sender, receiver, message } = data;
    
      if (!sender || !receiver) {
        console.error('유효하지 않은 데이터:', { sender, receiver });
        socket.emit('error', { message: 'Sender or receiver is missing' });
        return;
      }
    
      const query = `
    INSERT INTO messages (conversation_id, sender, receiver, message) 
    VALUES (?, (SELECT login_id FROM user WHERE user_id = ?), ?, ?)
  `;
    
      db.query(query, [roomId, sender, receiver, message], (err) => {
        if (err) {
          console.error('메시지 저장 중 데이터베이스 오류 발생:', err);
          socket.emit('error', { message: 'Database error' });
        } else {
          console.log('메시지 전송 성공:', data);
          io.to(roomId).emit('message', data);
        }
      });
    });

    // 6. 채팅방 생성 및 삭제 없음

    // 7. 클라이언트 연결 해제 처리
    socket.on('disconnect', () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        io.emit('activeUsers', Array.from(activeUsers));
      }
    });
  });

  // 8. 모듈 내보내기
  return io;
};

module.exports = socketSetup; // io 오브젝트 내보냄

