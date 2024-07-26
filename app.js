const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require('fs'); // 파일 시스템 모듈 추가
const app = express();
const port = 3000;


// 세션 디렉토리 경로
const sessionDir = path.join(__dirname, 'sessions');

// 세션 디렉토리 생성
if (!fs.existsSync(sessionDir)) {
  console.log('세션 디렉토리가 존재하지 않아 생성합니다:', sessionDir);
  try {
    fs.mkdirSync(sessionDir, { recursive: true });
    console.log('세션 디렉토리 생성 성공:', sessionDir);
  } catch (err) {
    console.log('세션 디렉토리 생성 실패:', err);
  }
} else {
  console.log('세션 디렉토리가 이미 존재합니다:', sessionDir);
}

// 권한 확인
fs.access(sessionDir, fs.constants.R_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.error('디렉토리에 대한 권한이 없습니다:', err);
  } else {
    console.log('디렉토리에 대한 권한이 있습니다:', sessionDir);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(express.static('public'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // 세션 파일 저장 경로 명시 및 재시도 횟수 설정
  store: new FileStore({
    path: sessionDir,
    retries: 5,
    reapInterval: 60,
    logFn: (message) => {
      console.log('[session-file-store]', message);
    },
    // 새로운 세션 파일 생성 로그 추가
    ttl: 3600,
    reapIntervalObject: setInterval(() => {
      console.log('Reaping expired sessions');
    }, 60000)
  })
}));

app.use((req, res, next) => {
  req.session.test = 'test';
  const sessionFilePath = path.join(sessionDir, req.sessionID + '.json');
  console.log('세션 파일 경로:', sessionFilePath);

  req.session.save((err) => {
    if (err) {
      console.error('세션 저장 중 에러 발생:', err);
    } else {
      console.log('세션 저장 성공');
      setTimeout(() => { // 세션 파일이 제대로 생성되었는지 확인하는 시간을 추가
        // 세션 파일 존재 여부 확인
        fs.access(sessionFilePath, fs.constants.F_OK, (err) => {
          if (err) {
            console.error('세션 파일을 찾을 수 없습니다:', sessionFilePath);
          } else {
            console.log('세션 파일이 존재합니다:', sessionFilePath);
          }
        });
      }, 100); // 100ms 후에 파일 확인
    }
    next();
  });
});

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

// 로그아웃 라우트
app.get('/logout', (req, res) => {
  if (req.session) {
    // 세션 파일 확인
    const sessionFile = path.join(sessionDir, req.sessionID + '.json');
    if (!fs.existsSync(sessionFile)) {
      console.error('로그아웃 시 세션 파일이 존재하지 않습니다:', sessionFile);
    } else {
      console.log('로그아웃 시 세션 파일이 존재합니다:', sessionFile);
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('세션 삭제 중 에러 발생:', err);
        res.status(500).send('서버 에러가 발생했습니다.');
      } else {
        fs.unlink(sessionFile, (err) => {
          if (err) {
            console.error('세션 파일 삭제 중 에러 발생:', err);
          } else {
            console.log('세션 파일 삭제 성공:', sessionFile);
          }
          res.redirect('/login');
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});


app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다`);
});


