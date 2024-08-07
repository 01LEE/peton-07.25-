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
  store: new FileStore({
    path: path.join(__dirname, 'sessions')  // 세션 파일을 저장할 디렉터리 명시적으로 지정
  })
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
const profileRouter = require('./routes/profile');
const jwtRouter = require('./routes/jwt'); // 추가된 부분

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

app.listen(port, '192.168.147.1', () => {
  console.log(`Server running at http://192.168.147.1:${port}/`);
});
