// HW

// 1.4
const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const path = require('path');
const app = require('./app'); // app.js 파일에서 익스프레스 애플리케이션을 가져옴
const db = require('./db'); // db.js 파일에서 데이터베이스 연결을 가져옴
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require('fs');
const { exec } = require('child_process');

const port = 3000; // 포트 번호 정의
const server = http.createServer(app);
const io = socketIo(server);

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

app.get('/getCurrentUser', (req, res) => {
  // 세션에서 현재 사용자 정보 가져오기
  if (req.session && req.session.login_id) {
    res.json({ sender: req.session.login_id, receiver: 'all' }); // 예: 모든 사용자가 메시지를 받을 수 있다고 가정
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

// 서버 상태 확인을 위한 엔드포인트 추가
app.get('/ping', (req, res) => {
  res.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (data) => {
    console.log('Received message:', data);
    const { sender, receiver, message } = data;
    const query = 'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)';
    db.query(query, [sender, receiver, message], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
      } else {
        console.log('Message saved to database:', data);
        io.emit('message', data); // 클라이언트로 메시지 브로드캐스트
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/messages', (req, res) => {
  const { sender, receiver } = req.query;
  const query = 'SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY timestamp';
  db.query(query, [sender, receiver, receiver, sender], (err, results) => {
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

// 정적 파일 제공 미들웨어 추가
app.use(express.static(path.join(__dirname, 'public')));

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

// 1.3
/*
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app'); // app.js 파일에서 익스프레스 애플리케이션을 가져옴

const port = 3000; // 포트 번호 정의
const server = http.createServer(app);
const io = socketIo(server);

const mysql = require('mysql'); // mysql 패키지 사용

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '980327!',
  database: 'peton'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (data) => {
    const { sender, receiver, message } = data;
    const query = 'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)';
    db.query(query, [sender, receiver, message], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
      } else {
        io.emit('message', data); // 클라이언트로 메시지 브로드캐스트
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 메시지 조회 API 추가
app.get('/messages', (req, res) => {
  const { sender, receiver } = req.query;
  const query = 'SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY timestamp';
  db.query(query, [sender, receiver, receiver, sender], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
*/