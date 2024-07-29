// HW

// 1.4
const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const path = require('path');
const app = require('./app'); // app.js 파일에서 익스프레스 애플리케이션을 가져옴
const db = require('./db'); // db.js 파일에서 데이터베이스 연결을 가져옴

const port = 3000; // 포트 번호 정의
const server = http.createServer(app);
const io = socketIo(server);

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