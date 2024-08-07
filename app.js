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
const db = require('./db');
const isAuthenticated = require('./middlewares/isAuthenticated');
const sessionremember = require('./middlewares/sessionremember');
const scrollBlocker = require('./middlewares/scrollBlocker');
const cors = require('cors');
const app = express();
// const ip = require('ip'); 미사용 주석 처리

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
    path: sessionDir
  })
});


app.use(sessionMiddleware); // 세션 미들웨어 적용

// 세션 미들웨어를 외부에서 접근할 수 있도록 설정
app.set('sessionMiddleware', sessionMiddleware);

// 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore({
    path: sessionDir
  })
})); // 기존 중복 코드 주석 처리

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

// app.use(express.static('public')); 중복 코드 주석 처리

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
const chatRouter = require('./routes/chat'); // 여기서 chat 라우터 추가
const chatlistRouter = require('./routes/chatlist'); // chatlist 라우터 추가
const usersRouter = require('./routes/users'); // users 라우터 추가


app.use('/', PW_findRouter);
app.use('/', ID_findRouter);
app.use('/', loginauthRouter);
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', noticeboardRouter);
app.use('/', trainerRouter);
app.use('/', myinfoRouter);
app.use('/', dogencyclopediaRouter);
app.use('/', chatRouter); // chat 라우터 사용
app.use('/', chatlistRouter); // chatlist 라우터 사용
app.use('/', usersRouter); // users 라우터 사용

app.get('/', (req, res) => {
  res.render('home', {title: 'Home Page '}); // EJS 템플릿 렌더링
});

// 08-06 추가
app.get('/ping', (req, res) => {
  res.sendStatus(200);
});

module.exports = app;
module.exports.sessionMiddleware = sessionMiddleware; // 세션 미들웨어 내보내기