const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyCode } = require('../services/signupService');
const { createUser } = require('../services/userService');


// 이메일 인증 코드 확인 라우트
router.post('/verify-code', verifyCode);

module.exports = router;
