// services/activeUsersService.js

// 현재 접속중인 유저 조회 user 테이블 및 sessions 테이블 조인
const db = require('../db');

exports.getActiveUsers = (callback) => {
  const query = `
    SELECT DISTINCT u.user_id, u.login_id, u.nick_name, u.email
    FROM user u
    JOIN sessions s ON u.user_id = s.user_id
    WHERE s.is_active = TRUE
  `;
  
  db.query(query, (err, rows) => {
    if (err) {
      console.error('Database query error:', err);
      return callback(err, null);
    }
    callback(null, rows);
  });
};
