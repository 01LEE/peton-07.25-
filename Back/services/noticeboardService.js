const exp = require('constants');
const db = require('../db');
const isYoursNoticeboard = require('../middlewares/isYoursNoticeboard');
const noticeboardService = require('../services/noticeboardService');
const { profile } = require('console');
// const session = require('express-session');
// const fs = require('fs');

// const path = require('path');
// const sessionDir = path.join(__dirname, '..', 'sessions');

// function checkSessionFiles() {
//     fs.readdir(sessionDir, (err, files) => {
//         if (err) {
//             console.error('세션 디렉토리 읽기 중 에러 발생: ', err);
//         } else {
//             console.log('현재 세션 파일 목록: ', files);
//         }
//     });
// }

// 게시판 목록을 가져오는 서비스 함수
exports.getNoticeboard = (req, res) => {
  // 페이지와 정렬 옵션을 쿼리 문자열에서 가져옵니다.
  const page = parseInt(req.query.page, 10) || 1; // 기본값으로 페이지 1
  const order = req.query.order || 'latest'; // 기본값으로 'latest'

  // 페이지당 항목 수
  const pageSize = 100000;
  const offset = (page - 1) * pageSize;

  // 정렬 쿼리를 결정합니다.
  let orderByClause;
  switch (order) {
    case 'fav':
      orderByClause = 'ORDER BY likeCount DESC';
      break;
    case 'view':
      orderByClause = 'ORDER BY view_count DESC';
      break;
    case 'latest':
    default:
      orderByClause = 'ORDER BY write_time DESC';
      break;
  }

  // 게시물 목록을 가져오는 쿼리
  const query = `
    SELECT 
      n.*, 
      (SELECT COUNT(*) FROM \`like\` l WHERE l.post_id = n.post_id) AS likeCount,
      (SELECT COUNT(*) FROM comment c WHERE c.post_id = n.post_id) AS commentCount,
      (SELECT COUNT(*) FROM recomment r WHERE r.comment_id IN (SELECT c.comment_id FROM comment c WHERE c.post_id = n.post_id)) AS recommentCount
    FROM 
      noticeboard n
    ${orderByClause}
    LIMIT ? OFFSET ?`;

  // 총 게시물 수를 가져오는 쿼리
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM noticeboard`;

  db.query(query, [pageSize, offset], (err, results) => {
    if (err) {
      console.error("게시판 조회 중 에러 발생: ", err);
      return res.status(500).json({ error: '서버 에러' });
    }

    // 총 게시물 수를 가져옵니다.
    db.query(countQuery, (err, countResults) => {
      if (err) {
        console.error("총 게시물 수 조회 중 에러 발생: ", err);
        return res.status(500).json({ error: '서버 에러' });
      }

      const totalItems = countResults[0].total;
      const totalPages = Math.ceil(totalItems / pageSize);

      // 댓글과 대댓글 수를 합산하여 totalCommentsCount를 계산합니다.
      results.forEach(post => {
        post.totalCommentsCount = post.commentCount + post.recommentCount;
      });

      // 결과를 JSON 형식으로 응답합니다.
      res.json(results, page, totalPages, order);
    });
  });
};

// 게시물 작성 서비스
exports.createPost = (req, res) => {
  const { title, description } = req.body;
  const login_id = req.session.login_id; // 로그인된 사용자의 ID를 가져옵니다.
  console.log(req.body);
  console.log(login_id);
  // 데이터베이스에 게시글을 삽입합니다.
  db.query(
      'INSERT INTO noticeboard (profile_image_url, nick_name, title, description, user_id, write_time, update_time) VALUES ((SELECT profile_image_url FROM user WHERE login_id = ?),(SELECT nick_name FROM user WHERE login_id = ?) ,?, ?, (SELECT user_id FROM user WHERE login_id = ? ),NOW(), NOW())',
      [login_id, login_id, title, description, login_id],
      (err, result) => {
          if (err) {
              console.error('게시글 생성 중 에러 발생:', err);
              return res.status(500).send('서버 에러');
          }
          res.json({ success: true });
      }
  );
};

// 게시물 상세 정보를 가져오는 서비스
exports.getPostDetail = (req, res) => {
  const post_id = req.params.post_id;
  const login_id = req.session.login_id;
  const user_id = req.session.userid;

  const incrementViewCountQuery = 'UPDATE noticeboard SET view_count = view_count + 1 WHERE post_id = ?';
  const postQuery = `
    SELECT n.*, (SELECT COUNT(*) FROM \`like\` l WHERE l.post_id = n.post_id) AS likeCount
    FROM noticeboard n WHERE n.post_id = ?`;
  const commentQuery = `
    SELECT c.*, 
            (SELECT COUNT(*) FROM comment_like cl WHERE cl.comment_id = c.comment_id) AS likeCount,
            (SELECT COUNT(*) FROM comment_unlike cu WHERE cu.comment_id = c.comment_id) AS dislikeCount
    FROM comment c WHERE c.post_id = ?`;
  const recommentQuery = `SELECT * FROM recomment WHERE comment_id = ?`;

  db.query(incrementViewCountQuery, [post_id], (err) => {
    if (err) {
      console.error("게시물 조회 수 증가 중 에러 발생: ", err);
      return res.status(500).json({ error: '서버 에러' });
    }

    db.query(postQuery, [post_id], (err, postResults) => {
      if (err) {
        console.error("게시물 조회 중 에러 발생: ", err);
        return res.status(500).json({ error: '서버 에러' });
      }
      if (postResults.length === 0) {
        return res.status(404).json({ error: '게시물이 존재하지 않습니다.' });
      }
      const post = postResults[0];

      db.query(commentQuery, [post_id], async (err, commentResults) => {
        if (err) {
          console.error("댓글 조회 중 에러 발생: ", err);
          return res.status(500).json({ error: '서버 에러' });
        }

        const fetchRecommentsForComments = commentResults.map(comment => {
          return new Promise((resolve, reject) => {
            db.query(recommentQuery, [comment.comment_id], (err, recommentResults) => {
              if (err) {
                return reject(err);
              }
              comment.recomments = recommentResults;
              resolve(comment);
            });
          });
        });

        try {
          const commentsWithRecomments = await Promise.all(fetchRecommentsForComments);
          const totalCommentsCount = commentsWithRecomments.reduce((count, comment) => {
            return count + 1 + comment.recomments.length;
          }, 0);

          const responseObject = {
            post,
            likeCount: post.likeCount,
            commentsWithRecomments,
            totalCommentsCount
          };

          res.json(responseObject);
        } catch (err) {
          console.error("대댓글 조회 중 에러 발생: ", err);
          res.status(500).json({ error: '서버 에러' });
        }
      });
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
    }

    // 댓글을 조회하고 대댓글 삭제 후 댓글 삭제 및 게시글 삭제
    db.query('SELECT comment_id FROM comment WHERE post_id = ?', [post_id], (err, commentResults) => {
      if (err) {
        console.error('댓글 조회 중 에러 발생:', err);
        return res.status(500).send('서버 에러');
      }

      // 대댓글 삭제
      const comments = commentResults.map(row => row.comment_id);
      
      if (comments.length > 0) {
        const commentIds = comments.map(() => '?').join(',');
        db.query(`DELETE FROM recomment WHERE comment_id IN (${commentIds})`, comments, (err) => {
          if (err) {
            console.error('대댓글 삭제 중 에러 발생:', err);
            return res.status(500).send('서버 에러');
          }

          // 댓글 삭제
          db.query('DELETE FROM comment WHERE post_id = ?', [post_id], (err) => {
            if (err) {
              console.error('댓글 삭제 중 에러 발생:', err);
              return res.status(500).send('서버 에러');
            }

            // 게시글 삭제
            db.query('DELETE FROM noticeboard WHERE post_id = ?', [post_id], (err) => {
              if (err) {
                console.error('게시글 삭제 중 에러 발생:', err);
                return res.status(500).send('서버 에러');
              }
              res.redirect('/noticeboard');
            });
          });
        });
      }
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

  // 댓글을 데이터베이스에 추가
  db.query(
    'INSERT INTO comment (post_id, user_id, c_description, write_time, update_time) VALUES (?, ?, ?, NOW(), NOW())',
    [post_id, user_id, c_description],
    (err, result) => {
      if (err) {
        console.error('댓글 추가 중 에러 발생:', err);
        return res.status(500).json({ success: false, message: '서버 에러가 발생했습니다.' });
      }

      // 댓글이 성공적으로 추가되었음을 알리는 JSON 응답
      return res.status(200).json({
        success: true,
        message: '댓글이 성공적으로 추가되었습니다.',
        commentId: result.insertId, // 새로 추가된 댓글의 ID 반환
      });
    }
  );
};

// 댓글을 수정하는 서비스 함수
exports.editComment = (req, res) => {
  const comment_id = req.params.comment_id;
  const { c_description } = req.body;
  
  db.query('UPDATE comment SET c_description = ?, update_time = NOW() WHERE comment_id = ?', [c_description, comment_id], (err, result) => {
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

  db.query('DELETE FROM recomment WHERE comment_id = ?', [comment_id], (err, results) => {
    if (err) {
      console.error('대댓글 삭제 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }
    db.query('DELETE FROM comment WHERE comment_id = ?', [comment_id], (err, result) => {
      if (err) {
        console.error('댓글 삭제 중 에러 발생:', err);
        return res.status(500).send('서버 에러');
      }
    })
    res.redirect(`/noticeboard/${req.params.post_id}`);
  });
};

// 좋아요 서비스
exports.likeUP = (req, res) => {
  const userId = req.session.userid;
  const post_id = req.params.post_id;

  // 좋아요가 이미 있는지 확인하는 쿼리
  const checkQuery = 'SELECT * FROM `like` WHERE user_id = ? AND post_id = ?';

  db.query(checkQuery, [userId, post_id], (err, results) => {
    if (err) {
      console.error('좋아요 확인 중 에러 발생:', err);
      return res.status(500).json({ message: '서버 에러' });
    }

    if (results.length > 0) {
      // 이미 좋아요가 있는 경우 삭제 쿼리 실행
      const deleteQuery = 'DELETE FROM `like` WHERE user_id = ? AND post_id = ?';

      db.query(deleteQuery, [userId, post_id], (err, result) => {
        if (err) {
          console.error('좋아요 삭제 중 에러 발생:', err);
          return res.status(500).json({ message: '서버 에러' });
        }

        return res.json({ message: '좋아요 취소됨', liked: false });
      });
    } else {
      // 좋아요가 없는 경우 추가 쿼리 실행
      const insertQuery = 'INSERT INTO `like` (user_id, post_id) VALUES (?, ?)';

      db.query(insertQuery, [userId, post_id], (err, result) => {
        if (err) {
          console.error('좋아요 추가 중 에러 발생:', err);
          return res.status(500).json({ message: '서버 에러' });
        }

        return res.json({ message: '좋아요 추가됨', liked: true });
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

// 대댓글을 추가하는 서비스 함수
exports.addRecomment = (req, res) => {
  const comment_id = req.params.comment_id;  // 부모 댓글 ID
  const post_id = req.params.post_id;        // 게시글 ID
  const { rc_description } = req.body;       // 답글 내용
  const user_id = req.session.userid;        // 현재 로그인된 사용자 ID

  // 답글을 데이터베이스에 추가하는 쿼리
  db.query('INSERT INTO recomment (comment_id, user_id, rc_description, write_time, update_time) VALUES (?, ?, ?, NOW(), NOW())',
    [comment_id, user_id, rc_description], (err, result) => {
    if (err) {
      console.error('답글 추가 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }
    // 답글 추가 후 게시글 상세 페이지로 리다이렉트
    res.redirect(`/noticeboard/${post_id}`);
  });
};

// 답글을 데이터베이스에서 삭제하는 쿼리
exports.deleteRecomment = (req, res) => {
  const recomment_id = req.params.recomment_id;

  db.query('DELETE FROM recomment WHERE recomment_id = ?', [recomment_id], (err, result) => {
    if (err) {
      console.error('대댓글 삭제 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }
    res.redirect(`/noticeboard/${req.params.post_id}`);
  })
}