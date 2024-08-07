// HW

// 1.5

// 모듈 및 변수 정의
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const app = require('./app'); // app.js 파일에서 익스프레스 애플리케이션을 가져옴
const db = require('./db'); // db.js 파일에서 데이터베이스 연결을 가져옴
const { v4: uuidv4 } = require('uuid'); // UUID 생성 모듈
const port = 3000; // 포트 번호 정의
const server = http.createServer(app);
const io = socketIo(server);

// 세션 설정
const sessionDir = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir);
}

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore({
    path: sessionDir
  })
});

app.use(sessionMiddleware);

// Socket.IO와 세션 미들웨어 통합
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

// 사용자 정보 가져오기
app.get('/getCurrentUser', (req, res) => {
  if (req.session && req.session.userid && req.session.login_id) {
    res.json({ 
      user_id: req.session.userid, 
      login_id: req.session.login_id, 
      sender: req.session.login_id, 
      receiver: 'all' 
    });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

// 서버 상태 확인
app.get('/ping', (req, res) => {
  res.sendStatus(200);
});

// 채팅방 ID 생성 엔드포인트
app.get('/createChatRoom', (req, res) => {
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

// 채팅방 목록 제공 엔드포인트
app.get('/chatRooms', (req, res) => {
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

// 채팅방 목록 페이지 렌더링
app.get('/chatlist', (req, res) => {
  res.render('chatlist');
});

// 개별 채팅방 페이지 렌더링
app.get('/chat', (req, res) => {
  res.render('chat');
});

// 메시지 제공
app.get('/messages', (req, res) => {
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

// 대화 내용 모두 지우기 라우트 추가
app.delete('/clearMessages', (req, res) => {
  const query = 'DELETE FROM messages';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Socket.IO 연결 설정
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (roomId) => {
    console.log(`Client joined room: ${roomId}`);
    socket.join(roomId);
  });

  socket.on('sendMessage', (data) => {
    const { roomId, sender, receiver, message } = data;
    const query = 'INSERT INTO messages (conversation_id, sender, receiver, message) VALUES (?, ?, ?, ?)';
    db.query(query, [roomId, sender, receiver, message], (err) => {
      if (err) {
        console.error('Database query error:', err);
      } else {
        io.to(roomId).emit('message', data);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 서버 시작 및 종료 처리
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});


// 서버 종료 이벤트 처리
const shutdown = () => {
  console.log('Shutting down server...');

  fs.readdir(sessionDir, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(sessionDir, file), (err) => {
        if (err) throw err;
      });
    }
  });
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// routes/users.js를 io와 함께 설정
/*
const userRouter = require('./routes/users')(io);
app.use('/', userRouter);
*/

// 1.4 
/*
// 모듈 및 변수 정의
const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const path = require('path');
const app = require('./app'); // app.js 파일에서 익스프레스 애플리케이션을 가져옴
const db = require('./db'); // db.js 파일에서 데이터베이스 연결을 가져옴
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); //UUID 생성 모듈
const { exec } = require('child_process');

const port = 3000; // 포트 번호 정의
const server = http.createServer(app);
const io = socketIo(server);


// 세션 설정
const sessionDir = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir);
}

const sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore({
    path: path.join(__dirname, 'sessions')
  })
});

app.use(sessionMiddleware);


// Socket.IO와 세션 미들웨어 통합
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});


// 정적 파일 제공 미들웨어 추가
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일이 필요 없을 경우 삭제


// 사용자 정보 가져오기
app.get('/getCurrentUser', (req, res) => {
  // 세션에서 현재 사용자 정보 가져오기
  if (req.session && req.session.userid && req.session.login_id) {
    res.json({ 
      user_id: req.session.userid, 
      login_id: req.session.login_id, 
      sender: req.session.login_id, 
      receiver: 'all' 
    });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});


// 서버 상태 확인
app.get('/ping', (req, res) => {
  res.sendStatus(200);
});


// 채팅방 ID 생성 엔드포인트
app.get('/createChatRoom', (req, res) => {
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
    

  //   console.log('Received message:', data);
  //   const { sender, receiver, message } = data;
  //   const query = 'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)';
  //   db.query(query, [sender, receiver, message], (err, result) => {
  //     if (err) {
  //       console.error('Database query error:', err);
  //     } else {
  //       console.log('Message saved to database:', data);
  //       io.emit('message', data); // 클라이언트로 메시지 브로드캐스트
  //     }
  //   });
  // });


  // 채팅방 목록 제공 엔드포인트
app.get('/chatRooms', (req, res) => {
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


// 채팅방 목록 페이지 렌더링
app.get('/chatlist', (req, res) => {
  res.render('chatlist');
});

// 개별 채팅방 페이지 렌더링
app.get('/chat', (req, res) => {
  res.render('chat');
});

// 메세지 제공 및 삭제
app.get('/messages', (req, res) => {
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

// 대화 내용 모두 지우기 라우트 추가
  app.delete('/clearMessages', (req, res) => {
    const query = 'DELETE FROM messages';
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
  });


// Socket.IO 연결 설정
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (roomId) => {
    console.log(`Client joined room: ${roomId}`);
    socket.join(roomId);
  });

  
  socket.on('sendMessage', (data) => {
    const { roomId, sender, receiver, message } = data;
    const query = 'INSERT INTO messages (conversation_id, sender, receiver, message) VALUES (?, ?, ?, ?)';
    db.query(query, [roomId, sender, receiver, message], (err) => {
      if (err) {
        console.error('Database query error:', err);
      } else {
        io.to(roomId).emit('message', data);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// 서버 시작 및 종료 처리
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

console.log('WebSocket server is running on ws://localhost:8080');

// 서버 종료 이벤트 처리

const shutdown = () => {
  console.log('Shutting down server...');

  // 세션 디렉토리의 파일을 모두 삭제
  fs.readdir(sessionDir, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(sessionDir, file), (err => {
        if (err) throw err;
      }));
    }
  });
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
*/