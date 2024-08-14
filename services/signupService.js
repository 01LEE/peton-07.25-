const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('../db');
const session = require('express-session');

exports.sendVerificationCode = (req, res) => {
    const { email } = req.body;
    console.log("이메일 전송 확인: ", req.body);
    
    const code = crypto.randomInt(100000, 999999).toString(); // 6자리 숫자 코드 생성

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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('이메일 발송 중 에러 발생: ', error);
            return res.status(500).json({ message: '서버 에러가 발생했습니다. 다시 시도해 주세요.' });
        }

        // 세션에 인증 코드와 이메일 저장
        req.session.emailVerificationCode = code;
        req.session.email = email;

        req.session.save(err => {
            if (err) {
                console.error('세션 저장 중 오류 발생: ', err);
                return res.status(500).json({ message: '세션 저장 중 오류가 발생했습니다.' });
            }

            console.log("세션에 저장된 인증 코드: ", req.session.emailVerificationCode);
            console.log("세션에 저장된 이메일: ", req.session.email);

            res.json({ message: '인증 코드가 이메일로 전송되었습니다. 이메일을 확인해 주세요.' });
        });
    });
};

exports.verifyCode = (req, res) => {
    const { email, code } = req.body;

    if (req.session.emailVerificationCode === code) {
        req.session.EmailCheck = true; // 이메일 인증 완료 플래그 설정
        req.session.email = email; // 이메일도 다시 저장 (필요 시)
        console.log("이메일 인증 완료. 세션에 저장된 EmailCheck:", req.session.EmailCheck);
        console.log("세션에 저장된 email:", req.session.email);
        
        res.json({ message: '이메일 인증이 완료되었습니다.' });
    } else {
        console.log("인증 코드가 잘못되었습니다.");
        res.status(400).json({ message: '인증 코드가 잘못되었습니다.' });
    }
};

