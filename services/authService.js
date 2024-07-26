const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('../db');

exports.sendVerificationCode = (req, res) => {
    const { email } = req.body;
    const code = crypto.randomInt(100000, 999999).toString(); // 6자리 숫자 코드 생성

    // 세션에 인증 코드와 이메일 저장
    req.session.emailVerificationCode = code;
    req.session.email = email;
    
    // 이메일 전송 알림을 즉시 전송
    res.json({ message: '인증 코드가 이메일로 전송되었습니다. 이메일을 확인해 주세요.' });
    
    // 이메일 발송 설정
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tkaqkrrhf11@gmail.com',
            pass: 'ldcw khts jmbi yvhl'
        }
    });

    const mailOptions = {
        from: 'tkaqkrrhf11@gmail.com',
        to: email,
        subject: '이메일 인증 코드',
        text: `이메일 인증 코드: ${code}`
    };
    
    // 비동기로 이메일 전송
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('이메일 발송 중 에러 발생: ', error);
            // 세션 초기화
            req.session.emailVerificationCode = null;
            req.session.email = null;
        }
    });
};

exports.verifyCode = (req, res) => {
    const { code } = req.body;

    if (req.session.emailVerificationCode === code) {
        req.session.emailVerificationCode = null;
        req.session.EmailCheck = true;
        res.json({ message: '이메일 인증이 완료되었습니다.' });
    } else {
        res.status(400).json({ message: '인증 코드가 잘못되었습니다.' });
    }
};
