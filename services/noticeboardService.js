const exp = require('constants');
const db = require('../db');
const isYoursNoticeboard = require('../middlewares/isYoursNoticeboard');
const noticeboardService = require('../services/noticeboardService');


// 게시판 목록을 가져오는 서비스 함수
exports.getNoticeboard = (req, res) => {
  // db.query('SELECT * FROM noticeboard ORDER BY write_time DESC' 최신순
  db.query('SELECT * FROM noticeboard', (err, results) => {
    if (err) {
      console.error("게시판 조회 중 에러 발생: ", err);
      res.status(500).send('서버 에러');
      return;
    }
    res.render('noticeboard/list', { noticeboard: results });
  });
};

// 게시글을 생성하는 서비스 함수
exports.createPost = (req, res) => {
  const { title, description } = req.body;
  const login_id = req.session.login_id;
  console.log("글 생성 시 로그인 id :", login_id);
  db.query('INSERT INTO noticeboard (nick_name, title, description, user_id, write_time, update_time) VALUES ((SELECT nick_name from user where login_id =?), ?, ?, (SELECT user_id FROM user WHERE login_id = ?), NOW(), NOW())',
      [login_id, title, description,  login_id], (err, result) => {
      if (err) {
          console.error('게시글 생성 중 에러 발생:', err);
          return res.status(500).send('서버 에러');
      }
      res.redirect('/noticeboard');
  });
};

// 게시물 상세 정보를 가져오는 서비스 함수

exports.getPostDetail = (req, res) => {
  const user_id = req.session.userid;
  const post_id = req.params.post_id;

  const query = `
  SELECT 
    n.*, 
    (SELECT COUNT(*) FROM \`like\` l WHERE l.post_id = n.post_id) AS likeCount
  FROM 
    noticeboard n
  WHERE 
    n.post_id = ?`;

const commentQuery = `
  SELECT 
    c.*, 
    (SELECT COUNT(*) FROM comment_like cl WHERE cl.comment_id = c.comment_id) AS likeCount,
    (SELECT COUNT(*) FROM comment_unlike cu WHERE cu.comment_id = c.comment_id) AS dislikeCount
  FROM 
    comment c
  WHERE 
    c.post_id = ?`;

db.query(query, [post_id], (err, results) => {
  if (err) {
    console.error("게시물 조회 중 에러 발생: ", err);
    res.status(500).send('서버 에러');
    return;
  }
  if (results.length === 0) {
    return res.status(404).send('게시물이 존재하지 않습니다.');
  }

  const post = results[0];

  // 댓글 목록 가져오기
  db.query(commentQuery, [post_id], (err, commentResults) => {
    if (err) {
      console.error("댓글 조회 중 에러 발생: ", err);
      return res.status(500).send('서버 에러');
    }

    // 템플릿에 데이터 전달
    res.render('noticeboard/detail', { post, likeCount: post.likeCount, comments: commentResults });
  });
});
};

// 게시물을 삭제하는 서비스 함수
exports.deletePost = (req, res) => {
  const user_id = req.session.userid;
  const post_id = req.params.post_id;

  // 게시글의 작성자와 현재 로그인된 사용자가 일치하는지 확인
  db.query('SELECT user_id FROM noticeboard WHERE post_id = ?', [post_id], (err, results) => {
    if (err) {
      console.error('게시글 조회 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }
    if (results.length === 0) {
      return res.status(404).send('게시물이 존재하지 않습니다.');
    }
    // 권한 확인
    if (!isYoursNoticeboard(user_id, results[0].user_id)) {
      return res.redirect(`/noticeboard/${post_id}`);
      // return res.status(403).send('권한이 없습니다.');
    }

    // 댓글 삭제
    db.query('DELETE FROM comment WHERE post_id = ?', [post_id], (err) => {
      if (err) {
        console.error('댓글 삭제 중 에러 발생:', err);
        return res.status(500).send('서버 에러');
      }

      // 게시글 삭제
      db.query('DELETE FROM noticeboard WHERE post_id = ?', [post_id], (err, result) => {
        if (err) {
          console.error('게시글 삭제 중 에러 발생:', err);
          return res.status(500).send('서버 에러');
        }
        res.redirect('/noticeboard');
      });
    });
  });
};

// 게시글을 수정하는 서비스 함수
exports.getEditDetail = (req, res) => {
  const user_id = req.session.userid;
  const post_id = req.params.post_id;
  db.query(`SELECT * FROM noticeboard WHERE post_id = ${post_id}`, (err, results) => {
    if(!isYoursNoticeboard(user_id, results[0].user_id)){
      return res.redirect(`/noticeboard/${post_id}`);
      // return res.status(403).send('권한이 없습니다.');
    }
    if (err) {
      console.error("게시물 조회 중 에러 발생: ", err);
      res.status(500).send('서버 에러');
      return;
    }
    if (results.length === 0) {
      return res.status(404).send('게시물이 존재하지 않습니다.');
    }
    return res.render('noticeboard/edit', { post: results[0] });
    // res.render('/noticeboard/edit/:post_id', {post : results[0]});
  });
};

// 게시글을 수정하는 서비스 함수
exports.editPost = (req, res) => {
  const { title, description } = req.body;
  const post_id = req.params.post_id;
  db.query('UPDATE noticeboard SET title = ?, description = ?, update_time = NOW() WHERE post_id = ?', [title, description, post_id], (err, result) => {
    if (err) {
      console.error('게시글 수정 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }
    // 수정 후 게시글 상세 페이지로 리다이렉트
    return res.redirect(`/noticeboard/${post_id}`);
  });
};

// 댓글을 추가하는 서비스 함수
exports.addComment = (req, res) => {
  const post_id = req.params.post_id;
  const { c_description } = req.body;
  const user_id = req.session.userid;

  db.query('INSERT INTO comment (post_id, user_id, c_description, write_time, update_time) VALUES (?, ?, ?, NOW(), NOW())',
    [post_id, user_id, c_description], (err, result) => {
    if (err) {
      console.error('댓글 추가 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }
    res.redirect(`/noticeboard/${post_id}`);
  });
};


// 게시물의 댓글을 가져오는 서비스 함수
exports.getComments = (post_id, callback) => {
  db.query('SELECT * FROM comment WHERE post_id = ?', [post_id], (err, results) => {
    if (err) {
      console.error('댓글 조회 중 에러 발생:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// 댓글을 수정하는 서비스 함수
exports.editComment = (req, res) => {
  const comment_id = req.params.comment_id;
  const { c_description } = req.body;

  db.query('UPDATE comment SET c_description = ?, update_time = NOW() WHERE id = ?', [c_description, comment_id], (err, result) => {
    if (err) {
      console.error('댓글 수정 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }
    res.redirect(`/noticeboard/${req.params.post_id}`);
  });
};

// 댓글을 삭제하는 서비스 함수
exports.deleteComment = (req, res) => {
  const comment_id = req.params.comment_id;

  db.query('DELETE FROM comment WHERE id = ?', [comment_id], (err, result) => {
    if (err) {
      console.error('댓글 삭제 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }
    res.redirect(`/noticeboard/${req.params.post_id}`);
  });
};

exports.likeUP = (req, res) => {
  const userId = req.session.userid;
  const post_id = req.params.post_id;

  // 좋아요가 이미 있는지 확인하는 쿼리
  const checkQuery = 'SELECT * FROM `like` WHERE user_id = ? AND post_id = ?';

  db.query(checkQuery, [userId, post_id], (err, results) => {
    if (err) {
      console.error('좋아요 확인 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }

    if (results.length > 0) {
      // 이미 좋아요가 있는 경우 삭제 쿼리 실행
      const deleteQuery = 'DELETE FROM `like` WHERE user_id = ? AND post_id = ?';

      db.query(deleteQuery, [userId, post_id], (err, result) => {
        if (err) {
          console.error('좋아요 삭제 중 에러 발생:', err);
          return res.status(500).send('서버 에러');
        }

        return res.redirect(`/noticeboard/${post_id}`);
      });
    } else {
      // 좋아요가 없는 경우 추가 쿼리 실행
      const insertQuery = 'INSERT INTO `like` (user_id, post_id) VALUES (?, ?)';

      db.query(insertQuery, [userId, post_id], (err, result) => {
        if (err) {
          console.error('좋아요 추가 중 에러 발생:', err);
          return res.status(500).send('서버 에러');
        }

        return res.redirect(`/noticeboard/${post_id}`);
      });
    }
  });
};

exports.commentlikeUp = (req, res) => {
  const userId = req.session.userid;
  const comment_id = req.params.comment_id;
  const post_id = req.params.post_id

  // 좋아요가 이미 있는지 확인하는 쿼리
  const checkQuery = 'SELECT * FROM comment_like WHERE user_id = ? AND comment_id = ?';

  db.query(checkQuery, [userId, comment_id], (err, results) => {
    if (err) {
      console.error('좋아요 확인 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }

    if (results.length > 0) {
      // 이미 좋아요가 있는 경우 삭제 쿼리 실행
      const deleteQuery = 'DELETE FROM comment_like WHERE user_id = ? AND comment_id = ?';

      db.query(deleteQuery, [userId, comment_id], (err, result) => {
        if (err) {
          console.error('좋아요 삭제 중 에러 발생:', err);
          return res.status(500).send('서버 에러');
        }

        return res.redirect(`/noticeboard/${post_id}`);
      });
    } else {
      // 좋아요가 없는 경우 추가 쿼리 실행
      const insertQuery = 'INSERT INTO comment_like (user_id, comment_id) VALUES (?, ?)';

      db.query(insertQuery, [userId, comment_id], (err, result) => {
        if (err) {
          console.error('좋아요 추가 중 에러 발생:', err);
          return res.status(500).send('서버 에러');
        }

        return res.redirect(`/noticeboard/${post_id}`);
      });
    }
  });
};

exports.commentlikeDown = (req, res) => {
  const userId = req.session.userid;
  const comment_id = req.params.comment_id;
  const post_id = req.params.post_id

  // 좋아요가 이미 있는지 확인하는 쿼리
  const checkQuery = 'SELECT * FROM comment_unlike WHERE user_id = ? AND comment_id = ?';

  db.query(checkQuery, [userId, comment_id], (err, results) => {
    if (err) {
      console.error('좋아요 확인 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }

    if (results.length > 0) {
      // 이미 좋아요가 있는 경우 삭제 쿼리 실행
      const deleteQuery = 'DELETE FROM comment_unlike WHERE user_id = ? AND comment_id = ?';

      db.query(deleteQuery, [userId, comment_id], (err, result) => {
        if (err) {
          console.error('좋아요 삭제 중 에러 발생:', err);
          return res.status(500).send('서버 에러');
        }

        return res.redirect(`/noticeboard/${post_id}`);
      });
    } else {
      // 좋아요가 없는 경우 추가 쿼리 실행
      const insertQuery = 'INSERT INTO comment_unlike (user_id, comment_id) VALUES (?, ?)';

      db.query(insertQuery, [userId, comment_id], (err, result) => {
        if (err) {
          console.error('좋아요 추가 중 에러 발생:', err);
          return res.status(500).send('서버 에러');
        }

        return res.redirect(`/noticeboard/${post_id}`);
      });
    }
  });
};



//   db.query('INSERT INTO like (user_id, post_id) VALUES (?,?)', [userId, postId] (err, result) => {
//     if (err) {
//     console.error('좋아요 중 에러 발생',err);
//     return res.status(404).send('서버 에러');
//   }
// })
// };
