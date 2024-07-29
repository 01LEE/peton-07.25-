// routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController'); // controllers 폴더에서 usersController 가져오기

router.get('/active-users', usersController.getActiveUsers);
router.get('/users', usersController.renderUsersPage);

// 다른 users 관련 라우트들을 여기에 추가할 수 있습니다.

module.exports = router;
