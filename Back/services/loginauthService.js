const db = require('../db');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const sessionDir = path.join(__dirname, '..', 'sessions');

function checkSessionFiles() {
    fs.readdir(sessionDir, (err, files) => {
        if (err) {
            console.error('세션 디렉토리 읽기 중 에러 발생: ', err);
        } else {
            console.log('현재 세션 파일 목록: ', files);
        }
    });
}

exports.login = (req, res) => {
    const { login_id, password, rememberMe } = req.body;
    console.log(req.body);
    
    const query = 'SELECT * FROM user WHERE login_id = ?';

    db.query(query, [login_id], async (err, results) => {
        if (err) {
            console.error("로그인 중 에러 발생: ", err);
            res.status(500).json({ success: false, message: '서버 에러' });
            return;
        }

        if (results.length === 0) {
            console.log("로그인 실패: 아이디 또는 패스워드가 틀렸습니다.");
            res.status(400).json({ success: false, message: '아이디 또는 패스워드가 틀렸습니다.' });
            return;
        }

        const user = results[0];
        
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log("로그인 실패: 아이디 또는 패스워드가 틀렸습니다.");
                res.status(400).json({ success: false, message: '아이디 또는 패스워드가 틀렸습니다.' });
                return;
            }

            req.session.userid = user.user_id;
            req.session.login_id = login_id;
            
            // 활성 세션 존재 여부 확인
            const checkSessionQuery = 'SELECT * FROM sessions WHERE user_id = ? AND is_active = TRUE';
            db.query(checkSessionQuery, [user.user_id], (err, sessionResults) => {
                if (err) {
                    console.error('세션 확인 중 에러 발생: ', err);
                    res.status(500).json({ success: false, message: '서버 에러' });
                    return;
                }

                if (sessionResults.length === 0) {
                    // 활성 세션이 없으면 새 세션 생성
                    const sessionQuery = 'INSERT INTO sessions (user_id) VALUES (?)';
                    db.query(sessionQuery, [user.user_id], (err, result) => {
                        if (err) {
                            console.error('세션 저장 중 에러 발생: ', err);
                            res.status(500).json({ success: false, message: '서버 에러' });
                            return;
                        }
                    });
                }
            });

            if (rememberMe) {
                res.cookie('rememberMe', login_id, { maxAge: 30 * 24 * 60 * 60 * 1000 }); 
            } else {
                res.clearCookie('rememberMe');
            }

            res.status(200).json({ success: true, message: '로그인 성공' });
            console.log("로그인 성공 ㅊㅊ");
        } catch (error) {
            console.error("비밀번호 비교 중 에러 발생: ", error);
            res.status(500).json({ success: false, message: '서버 에러' });
        } 
    });
};

exports.logout = (req, res) => {
    const userId = req.session.userid;
    
    req.session.destroy((err) => {
        if (err) {
            console.error("로그아웃 중 에러 발생: ", err);
            return res.status(500).send('서버 에러');
        }

        const sessionQuery = 'UPDATE sessions SET logout_time = NOW(), is_active = FALSE WHERE user_id = ? AND is_active = TRUE';
        db.query(sessionQuery, [userId], (err, result) => {
            if (err) {
                console.error('세션 업데이트 중 에러 발생: ', err);
            }
        });

        res.clearCookie('connect.sid', { path: '/' });

        console.log('로그아웃 성공 ㅊㅊ');
        res.status(200).json({ message: 'Logout successful' });
    });
};
