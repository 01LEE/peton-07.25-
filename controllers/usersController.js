// controllers/usersController.js
const activeUsersService = require('../services/activeUsersService');

exports.getActiveUsers = (req, res) => {
  activeUsersService.getActiveUsers((err, rows) => {
    if (err) {
      return res.status(500).send('Error fetching active users');
    }
    res.status(200).json(rows);
  });
};

exports.renderUsersPage = (req, res) => {
  res.render('users');
};

// 다른 users 관련 컨트롤러 함수들을 여기에 추가할 수 있습니다.
