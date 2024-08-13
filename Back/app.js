const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:8080', // 허용할 프론트엔드 도메인
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
  saveUninitialized: true,
  store: new FileStore({
    path: sessionDir,
    retries: 2
  })
});

app.use(sessionMiddleware);

// 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));
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


// 라우터 등록
app.use('/api/find/password', PW_findRouter);
app.use('/api/find/id', ID_findRouter);
app.use('/api', loginRouter);
app.use('/api', signupRouter);
app.use('/api/user', userRouter);
app.use('/api/notice', noticeboardRouter);
app.use('/api/trainer', trainerRouter);
app.use('/api/myinfo', myinfoRouter);
app.use('/api/dogencyclopedia', dogencyclopediaRouter);
app.use('/api/profile', profileRouter);
app.use('/api/jwt', jwtRouter);
app.use('/api/chat', chatRouter);
app.use('/api/chatlist', chatlistRouter);
app.use('/api/users', usersRouter);
// 이메일 인증 코드 전송
router.post('/api/send-verification-code', sendVerificationCode);

// 이메일 인증 코드 확인
router.post('/api/verify-code', verifyCode);

// Vue.js 라우터와 연결
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Front/my-vue-app/dist', 'index.html'));
});

// 서버 시작
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = { app, sessionMiddleware, sessionDir };
