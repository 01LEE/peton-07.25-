// const isYoursNoticeboard = require('../middlewares/isYoursNoticeboard');

// const checkAuthorization = (req, res, next) => {
//     const user_id = req.session.userid;
//     const post_id = req.params.post_id;

//     db.query('SELECT user_id FROM noticeboard WHERE post_id = ?', [post_id], (err, results) => {
//     if (err) {
//         console.error("게시물 조회 중 에러 발생: ", err);
//         return res.status(500).send('서버 에러');
//     }
//     if (results.length === 0) {
//         return res.status(404).send('게시물이 존재하지 않습니다.');
//     }

//     req.auth = isYoursNoticeboard(user_id, results[0].user_id);
//     next();
//     });
// };

// module.exports = checkAuthorization;
