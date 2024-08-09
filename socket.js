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
      socket.join(roomId);
    });

    // 5. 메시지 전송
    socket.on('sendMessage', (data) => {
      const { roomId, sender, receiver, message } = data;
      if (!sender) {
        socket.emit('error', { message: 'Sender is missing' });
        return;
      }
      const query = 'INSERT INTO messages (conversation_id, sender, receiver, message) VALUES (?, ?, ?, ?)';
      db.query(query, [roomId, sender, receiver, message], (err) => {
        if (err) {
          socket.emit('error', { message: 'Database error' });
        } else {
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


// 1.0 안정화 버전 0808 pm 09:42
/*
// 1. 모듈 가져오기 및 초기 설정
    const socketSetup = (server) => { // socket.io 서버를 설정하는 함수
    const io = require('socket.io')(server); // WebSocket 서버 설정
    const db = require('./db'); // db모듈을 가져옵니다
    const activeUsers = new Set(); // 활성 사용자 목록 관리
  
    // 2. 클라이언트 연결 처리
    io.on('connection', (socket) => {
      console.log('New client connected');
      
      // 3. 사용자 등록 및 연결
      socket.on('register', (data) => {
        const { userId } = data;
        socket.userId = userId; // 소켓 객체에 사용자 ID를 저장
        activeUsers.add(userId);
        socket.join(userId);
        console.log(`User ${userId} registered and joined room: ${userId}`);
        io.emit('activeUsers', Array.from(activeUsers)); // 활성 사용자 목록 갱신
    });
      
      // 4. 채팅방 입장
      socket.on('joinRoom', (roomId) => {
        console.log(`Client joined room: ${roomId}`);
        socket.join(roomId);
      });
  
      // 5. 메시지 전송
      socket.on('sendMessage', (data) => {
        const { roomId, sender, receiver, message } = data;
        if (!sender) {
          console.error('Sender is missing');
          socket.emit('error', { message: 'Sender is missing' });
          return;
        }
        const query = 'INSERT INTO messages (conversation_id, sender, receiver, message) VALUES (?, ?, ?, ?)';
        db.query(query, [roomId, sender, receiver, message], (err) => {
          if (err) {
            console.error('Database query error:', err);
            socket.emit('error', { message: 'Database error' });
          } else {
            io.to(roomId).emit('message', data);
          }
        });
      });






      // 6. 채팅방 생성 및 삭제
      socket.on('chatRoomCreated', (data) => {
        io.emit('chatRoomCreated', data);
      });
  
      socket.on('chatRoomDeleted', (data) => {
        io.emit('chatRoomDeleted', data);
      });
  

      // 7. 클라이언트 연결 해제 처리
      socket.on('disconnect', () => {
        if (socket.userId) {
            activeUsers.delete(socket.userId);
            console.log(`User ${socket.userId} disconnected`);
            io.emit('activeUsers', Array.from(activeUsers)); // 활성 사용자 목록 갱신
        }
    });
});


// 8. 모듈 내보내기
return io;
};

module.exports = socketSetup;
*/