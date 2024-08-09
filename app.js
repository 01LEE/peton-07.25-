// app.js 파일

// 1.1 리팩토링 및 소켓기능 추가 안정화 완

const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./db');
// const isAuthenticated = require('./middlewares/isAuthenticated');
// const activeUsersService = require('./services/activeUsersService');

// body-parser 없음 express 내장 미들웨어로 합쳐짐 선언 안해도됨

const app = express();

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
app.set('sessionMiddleware', sessionMiddleware);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

// 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   store: new FileStore({
//     path: path.join(__dirname, 'sessions')  // 세션 파일을 저장할 디렉터리 명시적으로 지정
//   })
// }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

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
const profileRouter = require('./routes/profile');
const jwtRouter = require('./routes/jwt');
const chatRouter = require('./routes/chat');
const chatlistRouter = require('./routes/chatlist');
const usersRouter = require('./routes/users');

app.use('/', PW_findRouter);
app.use('/', ID_findRouter);
app.use('/', loginauthRouter);
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', noticeboardRouter);
app.use('/', trainerRouter);
app.use('/', myinfoRouter);
app.use('/', dogencyclopediaRouter);
app.use('/', profileRouter);
app.use('/jwt', jwtRouter);
app.use('/', chatRouter);
app.use('/', chatlistRouter);
app.use('/', usersRouter);

app.get('/', (req, res) => {
  res.render('home', { title: 'Home Page' });
});

app.get('/ping', (req, res) => {
  res.sendStatus(200);
});

// const server = http.createServer(app);
// const io = socketSetup(server);

module.exports = { app, sessionMiddleware, sessionDir };


// 1.0 안정화 버전 0808 pm 09:42
/*
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
    retries: 2 // 재시도 횟수를 설정하여 일시적인 파일 잠금 문제 해결
  })
});

app.use(sessionMiddleware); // 세션 미들웨어 적용

// 세션 미들웨어를 외부에서 접근할 수 있도록 설정
app.set('sessionMiddleware', sessionMiddleware);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

// 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   store: new FileStore({
//     path: path.join(__dirname, 'sessions')  // 세션 파일을 저장할 디렉터리 명시적으로 지정
//   })
// }));




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
const profileRouter = require('./routes/profile');
const jwtRouter = require('./routes/jwt'); // 추가된 부분
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
app.use('/', profileRouter);
app.use('/jwt', jwtRouter); // 추가된 부분
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

*/