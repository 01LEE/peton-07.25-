const db = require('../db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const sessionDir = path.join(__dirname, '..', 'sessions');

// 세션 파일 확인 함수
function checkSessionFiles() {
    fs.readdir(sessionDir, (err, files) => {
        if (err) {
            console.error('세션 디렉토리 읽기 중 에러 발생: ', err);
        } else {
            console.log('현재 세션 파일 목록: ', files);
        }
    });
}

// 로그인 처리 함수
exports.login = (req, res) => {
    const { login_id, password, rememberMe } = req.body;
    console.log(req.body);

    const query = 'SELECT * FROM user WHERE login_id = ?';

    db.query(query, [login_id], async (err, results) => {
        if (err) {
            console.error("로그인 중 에러 발생: ", err);
            return res.status(500).json({ success: false, message: '서버 에러' });
        }

        if (results.length === 0) {
            console.log("로그인 실패: 아이디 또는 패스워드가 틀렸습니다.");
            return res.status(400).json({ success: false, message: '아이디 또는 패스워드가 틀렸습니다.' });
        }

        const user = results[0];

        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log("로그인 실패: 아이디 또는 패스워드가 틀렸습니다.");
                return res.status(400).json({ success: false, message: '아이디 또는 패스워드가 틀렸습니다.' });
            }

            // 세션에 사용자 정보 저장
            req.session.userid = user.user_id;
            req.session.login_id = login_id;

            // 세션 테이블에 세션 기록 추가
            const sessionQuery = 'INSERT INTO sessions (user_id) VALUES (?)';
            db.query(sessionQuery, [user.user_id], (err, result) => {
                if (err) {
                    console.error('세션 저장 중 에러 발생: ', err);
                    // 세션 저장 오류 시 클라이언트에게 알려주지 않고, 단순히 로그로 기록
                }
            });

            // Remember Me 기능 처리
            if (rememberMe) {
                res.cookie('rememberMe', login_id, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30일
            } else {
                res.clearCookie('rememberMe');
            }

            res.status(200).json({ success: true, message: '로그인 성공' });
        } catch (error) {
            console.error("비밀번호 비교 중 에러 발생: ", error);
            return res.status(500).json({ success: false, message: '서버 에러' });
        }
    });
};

// 로그아웃 처리 함수
exports.logout = (req, res) => {
    const userId = req.session.userid;
    
    req.session.destroy((err) => {
        if (err) {
            console.error("로그아웃 중 에러 발생: ", err);
            return res.status(500).send('서버 에러');
        }

        // 세션 테이블에서 로그아웃 시간 업데이트
        const sessionQuery = 'UPDATE sessions SET logout_time = NOW(), is_active = FALSE WHERE user_id = ? AND is_active = TRUE';
        db.query(sessionQuery, [userId], (err, result) => {
            if (err) {
                console.error('세션 업데이트 중 에러 발생: ', err);
            }
        });

        // 세션 쿠키 제거
        res.clearCookie('connect.sid', { path: '/' });
        checkSessionFiles();
        res.redirect('/');
    });
};
