const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('../db');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { id, password, confirmPassword, email } = req.body;

  // req.body 로그 출력
  console.log("Received req.body: ", JSON.stringify(req.body));

  // 각 필드 로그 출력
  console.log("ID: " , id);
  console.log("Password: " , password);
  console.log("Confirm Password: " ,confirmPassword);
  console.log("Email: " , email);
  
  console.log("세션에 저장된 이메일: ", req.session.email);
  console.log("세션에 저장된 EmailCheck: ", req.session.EmailCheck);

  if (password !== confirmPassword) {
    console.log("Password and Confirm Password do not match.");
    return res.send('<script>alert("비밀번호가 일치하지 않습니다."); window.history.back();</script>');
  }

  if (!req.session.EmailCheck || req.session.email !== email) {
    console.log("Email verification is not completed or email does not match.");
    return res.send('<script>alert("이메일 인증이 필요합니다."); window.history.back();</script>');
  }

  const checkQuery = 'SELECT COUNT(*) AS count FROM user WHERE login_id = ?';
  
  // 아이디 중복 확인 쿼리 실행
  db.query(checkQuery, [id], async (err, results) => {
    if (err) {
      console.error("Error checking ID duplication: ", err);
      return res.send('<script>alert("서버 에러가 발생했습니다. 다시 시도해 주세요."); window.history.back();</script>');
    }

    console.log("ID Duplication Check Result: ", results);

    if (results[0].count > 0) {
      console.log("ID is already in use.");
      return res.send('<script>alert("이미 아이디가 사용 중입니다."); window.history.back();</script>');
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      console.log("Generated salt: ", salt);
      console.log("Hashed Password: ", hashedPassword);

      const query = 'INSERT INTO user (login_id, password, email, create_time) VALUES (?, ?, ?, NOW())';
      
      // 사용자 등록 쿼리 실행
      db.query(query, [id, hashedPassword, email], (err, result) => {
        if (err) {
          console.error("Error during user registration: ", err);
          return res.send('<script>alert("서버 에러가 발생했습니다. 다시 시도해 주세요."); window.history.back();</script>');
        }

        console.log("User registration successful: ", result);

        req.session.email = null;
        req.session.EmailCheck = false;

        res.send('<script>alert("회원가입이 성공적으로 완료되었습니다."); window.location.href = "/login";</script>');
      });
    } catch (error) {
      console.error("Error during password hashing: ", error);
      res.send('<script>alert("서버 에러가 발생했습니다. 다시 시도해 주세요."); window.history.back();</script>');
    }
  });
};
