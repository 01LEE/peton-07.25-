const mysql = require('mysql');
require('dotenv').config(); // dotenv 패키지를 로드합니다.

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '10qp29wo', // 환경 변수에서 비밀번호를 가져옵니다.
  database: 'peton'
});

db.connect((err) => {
  if (err) {
    console.error("MySQL 데이터베이스 연결 실패: ", err);
    process.exit(1);
  }
  console.log("MySQL 데이터베이스에 연결되었습니다");
});

module.exports = db;
