const db = require('../db');
const bcrypt = require('bcrypt');
const session = require('express-session');
// ㅡㅡ아래 3줄 추가ㅡㅡ
const fs = require('fs');
const path = require('path');
const sessionDir = path.join(__dirname, '..', 'sessions');



// ㅡㅡ세션 디렉토리와 파일을 확인하는 함수ㅡㅡ
function checkSessionFiles() {
  fs.readdir(sessionDir, (err, files) => {
    if (err) {
      console.error('세션 디렉토리 읽기 중 에러 발생: ', err);
    } else {
      console.log('현재 세션 파일 목록: ', files);
    }
  });
}
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

exports.login = (req, res) => {
  const { login_id, password, rememberMe} = req.body;
  const query = 'SELECT * FROM user WHERE login_id = ?';

  db.query(query, [login_id], async (err, results) => {
    if (err) {
      console.error("로그인 중 에러 발생: ", err);
      res.status(500).send('서버 에러');
      return;
    }

    if (results.length === 0) {
      console.log("로그인 실패: 아이디 또는 패스워드가 틀렸습니다.");
      res.send('<script>alert("아이디 또는 패스워드가 틀렸습니다."); window.location.href = "/login";</script>');
      return;
    }

    const user = results[0];
    
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("로그인 실패: 아이디 또는 패스워드가 틀렸습니다.");
        res.send('<script>alert("아이디 또는 패스워드가 틀렸습니다."); window.location.href = "/login";</script>');
        return;
      }

      

      req.session.userid = user.user_id; // 세션에 user_id 저장
      req.session.login_id = login_id;

      const sessionQuery = 'INSERT INTO sessions (user_id) VALUES (?)';
      db.query(sessionQuery, [user.user_id], (err, result) => {
        if (err) {
          console.error('세션 저장 중 에러 발생: ', err);
          res.status(500).send('서버 에러');
          return;
        }
      });

      if (rememberMe) {
        console.log(rememberMe, '시발 !!');
        res.cookie('rememberMe', login_id, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30일 동안 쿠키 저장
      } else {
        res.clearCookie('rememberMe');
      }

      console.log("로그인 성공");
      res.send('<script>alert("로그인 성공."); window.location.href = "/";</script>');
    } catch (error) {
      console.error("비밀번호 비교 중 에러 발생: ", error);
      res.status(500).send('서버 에러');
    } 
  });
};

exports.logout = (req, res) => {
  console.log('로그아웃 시도 중...');
  const userId = req.session.userid; // userId 변수를 올바르게 정의
  req.session.destroy((err) => {
    if (err) {
      console.error("로그아웃 중 에러 발생: ", err);
      res.status(500).send('서버 에러');
      return;
    }

    const sessionQuery = 'UPDATE sessions SET logout_time = NOW(), is_active = FALSE WHERE user_id = ? AND is_active = TRUE';
    db.query(sessionQuery, [userId], (err, result) => {
      if (err) {
        console.error('세션 업데이트 중 에러 발생: ', err);
      }
    });

    console.log('세션 파괴 완료');
    res.clearCookie('connect.sid', { path: '/' });
    checkSessionFiles(); // 세션 파일 확인
    res.redirect('/');
  });
};