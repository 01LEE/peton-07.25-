// HW

// 1.1 리팩토링 및 소켓 기능 추가 0809 안정화 완

const http = require('http');
const { app, sessionMiddleware, sessionDir } = require('./app');
const socketSetup = require('./socket');
const fs = require('fs');
const db = require('./db');


const server = http.createServer(app);
const io = socketSetup(server, sessionMiddleware); // sessionMiddleware를 소켓에 통합

console.log("io:", io);  // io가 올바르게 초기화되었는지 확인

// Socket.IO와 세션 미들웨어 통합
// io.use((socket, next) => {
//   sessionMiddleware(socket.request, socket.request.res || {}, next);
// });

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

// 서버 시작
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

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

  console.log('서버 종료');
  process.exit(0);
};

// 서버 종료 시그널을 처리
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = { server, io };  // io 내보내기


// 1.0 안정화 버전 0808 pm 09:42
/*
// 모듈 및 변수 정의
const express = require('express');
const http = require('http');
const path = require('path');

const socketSetup = require('./socket'); // socket.js 파일에서 소켓 을 가져옴
const app = require('./app'); // app.js 파일에서 익스프레스 애플리케이션을 가져옴
const db = require('./db'); // db.js 파일에서 데이터베이스 연결을 가져옴
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); //UUID 생성 모듈

const server = http.createServer(app);
const io = socketSetup(server);


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


// 서버 시작 및 종료 처리
const port = process.env.PORT || 3000;
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
    console.log('서버 종료');
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
*/