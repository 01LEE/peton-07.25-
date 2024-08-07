const socketSetup = (server) => {
  const io = require('socket.io')(server);
  const db = require('./db'); // db모듈을 가져옵니다

  io.on('connection', (socket) => {
    console.log('New client connected');

    // 특정 방 참여
    
    socket.on('register', (data) => {
      const { userId } = data;
      socket.join(userId);
      console.log(`User ${userId} registered and joined room: ${userId}`);
    });
    

    // 채팅방 입장
    socket.on('joinRoom', (roomId) => {
      console.log(`Client joined room: ${roomId}`);
      socket.join(roomId);
    });

    // 메시지 전송
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

    socket.on('chatRoomCreated', (data) => {
      io.emit('chatRoomCreated', data);
    });

    socket.on('chatRoomDeleted', (data) => {
      io.emit('chatRoomDeleted', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = socketSetup;