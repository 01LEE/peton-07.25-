// 기존 버전
/*
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const app = express();
const port = 3000;
const ip = require('ip');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// 라우터 설정
const loginauthRouter = require('./routes/loginauth');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const noticeboardRouter = require('./routes/noticeboard');
const trainerRouter = require('./routes/trainer');
const myinfoRouter = require('./routes/myinfo');
const dogencyclopediaRouter = require('./routes/dogencyclopedia');
const ID_findRouter = require('./routes/userfind/ID_find');
const PW_findRouter = require('./routes/userfind/PW_find');

// const userfind = require('./routes/userfind');

app.use('/', PW_findRouter);
app.use('/', ID_findRouter);
app.use('/', loginauthRouter);
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', noticeboardRouter);
app.use('/', trainerRouter);
app.use('/', myinfoRouter);
app.use('/', dogencyclopediaRouter);
// app.use('/', userfindRouter);


app.listen(port, () => {
  console.log(`Server running at localhost:${port}/`);
});
*/
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require('fs');
const isAuthenticated = require('./middlewares/isAuthenticated');
const sessionremember = require('./middlewares/sessionremember');
const scrollBlocker = require('./middlewares/scrollBlocker');
const app = express();
const ip = require('ip');

// 세션 디렉토리 확인 및 생성
const sessionDir = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore({
    path: sessionDir
  })
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// 로그인 상태를 모든 템플릿에 전달
app.use((req, res, next) => {
  res.locals.login_id = req.session.login_id || null;
  next();
});

// 라우터 설정
const loginauthRouter = require('./routes/loginauth');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const noticeboardRouter = require('./routes/noticeboard');
const trainerRouter = require('./routes/trainer');
const myinfoRouter = require('./routes/myinfo');
const dogencyclopediaRouter = require('./routes/dogencyclopedia');
const ID_findRouter = require('./routes/userfind/ID_find');
const PW_findRouter = require('./routes/userfind/PW_find');

app.use('/', PW_findRouter);
app.use('/', ID_findRouter);
app.use('/', loginauthRouter);
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', noticeboardRouter);
app.use('/', trainerRouter);
app.use('/', myinfoRouter);
app.use('/', dogencyclopediaRouter);

app.get('/', (req, res) => {
  res.render('home'); // EJS 템플릿 렌더링
});

// 채팅방 라우트 보호
app.get('/chat', isAuthenticated, scrollBlocker, (req, res) => {
  res.render('chat'); // EJS 템플릿 렌더링
});

// 현재 사용자 정보를 제공하는 라우트 추가
app.get('/getCurrentUser', (req, res) => {
  const currentUser = req.session.login_id || 'guest';
  const receiver = 'receiver_id'; // 실제 채팅 상대방의 ID로 대체
  res.json({ sender: currentUser, receiver: receiver });
});

module.exports = app;
