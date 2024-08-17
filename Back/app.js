const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors');
const http = require('http');
const socketSetup = require('./socket');
const db = require('./db');

const app = express();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:8080', // 허용할 프론트엔드 도메인
  methods: ["GET", "POST"],
  credentials: true, // 쿠키를 포함한 요청을 허용
}));

// 세션 디렉토리 확인 및 생성
const sessionDir = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir);
}

// 세션 미들웨어 설정
const sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false, // 초기화되지 않은 세션 저장 방지
  store: new FileStore({
    path: sessionDir,
    retries: 2
  }),
  cookie: {
    secure: false, // HTTPS 사용 시 true로 설정
    maxAge: 600000 // 10분간 세션 유지
  }
});

app.use(sessionMiddleware); // 세션 미들웨어는 다른 미들웨어보다 앞에 있어야 함

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Vue.js 빌드된 파일을 정적 파일로 제공
app.use(express.static(path.join(__dirname, '../Front/my-vue-app/dist')));

// 라우터 설정
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const userRouter = require('./routes/user');
const noticeboardRouter = require('./routes/noticeboard');
const trainerRouter = require('./routes/trainer');
const myinfoRouter = require('./routes/myinfo');
const dogencyclopediaRouter = require('./routes/dogencyclopedia');
const ID_findRouter = require('./routes/userfind/ID_find');
const PW_findRouter = require('./routes/userfind/PW_find');
const profileRouter = require('./routes/profile');
const jwtRouter = require('./routes/jwt');
const chatRouter = require('./routes/chat');
const chatlistRouter = require('./routes/chatlist');
const usersRouter = require('./routes/users');
const chatbuttonRouter = require('./routes/chatbutton');  // 새로운 API 라우터

// 라우터 등록
app.use('/api/find/password', PW_findRouter);
app.use('/api/find/id', ID_findRouter);
app.use('/api', loginRouter);
app.use('/api/signup', signupRouter);
app.use('/api/user', userRouter);
app.use('/api/notice', noticeboardRouter);
app.use('/api/trainer', trainerRouter);
app.use('/api/myinfo', myinfoRouter);
app.use('/api/dogencyclopedia', dogencyclopediaRouter);
app.use('/api/profile', profileRouter);
app.use('/api/jwt', jwtRouter);
app.use('/api', chatRouter);
app.use('/api', chatlistRouter);
app.use('/api', usersRouter);
app.use('/api', chatbuttonRouter);

// Vue.js 라우터와 연결
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Front/my-vue-app/dist', 'index.html'));
});

// HTTP 서버와 Socket.IO 서버 통합
const server = http.createServer(app);
const io = socketSetup(server, sessionMiddleware); // Socket.IO 설정

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
  // 데이터베이스에서 sessions 테이블을 비웁니다.
  db.query('DELETE FROM sessions', (err, result) => {
    if (err) {
      console.error('Error clearing sessions table:', err);
    } else {
      console.log('Sessions table cleared');
    }
  });

  console.log('세션 디렉토리 파일 및 데이터베이스 세션 삭제 완료');
  process.exit(0);
};

// 서버 종료 시그널을 처리
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// 서버 시작
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = { app, sessionMiddleware, sessionDir };
