const http = require('http');
const { app, sessionMiddleware, sessionDir } = require('./app'); // app.js에서 app을 가져옵니다.
const socketSetup = require('./socket');
const fs = require('fs');
const path = require('path'); // 추가: path 모듈 필요

const server = http.createServer(app);
const io = socketSetup(server, sessionMiddleware); // sessionMiddleware를 소켓에 통합

 // io가 올바르게 초기화되었는지 확인

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
