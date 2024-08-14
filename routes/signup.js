const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyCode } = require('../services/signupService');
const { createUser } = require('../services/userService');

// 이메일 인증 코드 전송 라우트
router.post('/send-verification-code', sendVerificationCode);

// 이메일 인증 코드 확인 라우트
router.post('/verify-code', verifyCode);

// 회원가입 요청 처리
router.post('/createuser', createUser);

module.exports = router;
