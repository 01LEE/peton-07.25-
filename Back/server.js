const http = require('http');
const { app, sessionMiddleware, sessionDir } = require('./app'); // app.js에서 app을 가져옵니다.
const socketSetup = require('./socket');
const fs = require('fs');
const path = require('path'); // 추가: path 모듈 필요
const db = require('./db');

const server = http.createServer(app);
const io = socketSetup(server, sessionMiddleware); // sessionMiddleware를 소켓에 통합

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

module.exports = { server, io };  // io 내보내기
