const express = require('express');
const router = express.Router();
const loginauthService = require('../services/loginauthService');

// 로그인 라우트
router.post('/', loginauthService.login);

// 로그아웃 라우트
router.get('/logout', loginauthService.logout);

module.exports = router;
