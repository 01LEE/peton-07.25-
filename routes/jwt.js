const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// 서비스 계정 키 파일 경로
const keyFilePath = path.join(__dirname, '..', 'peton-429909-72f4cd54bf9a.json');
const key = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

// JWT 발행 시간 및 만료 시간 설정
const iat = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
const exp = iat + 3600; // 현재 시간으로부터 1시간 후 (3600초)

// JWT 클레임 설정
const jwtClaims = {
  iss: key.client_email, // 서비스 계정 이메일
  sub: key.client_email, // 서비스 계정 이메일
  aud: 'https://oauth2.googleapis.com/token', // OAuth2 토큰 엔드포인트
  iat: iat,
  exp: exp,
  scope: 'https://www.googleapis.com/auth/cloud-platform' // 필요한 권한 범위
};

// JWT 생성
const token = jwt.sign(jwtClaims, key.private_key, { algorithm: 'RS256' });

console.log('Generated JWT:', token);

// OAuth2 토큰 엔드포인트
const tokenUrl = 'https://oauth2.googleapis.com/token';

// JWT를 사용하여 토큰 요청
router.get('/get-token', async (req, res) => {
  try {
    const response = await axios.post(tokenUrl, null, {
      params: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const accessToken = response.data.access_token;
    console.log('Access Token:', accessToken);
    res.json({ accessToken });
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

module.exports = router;
