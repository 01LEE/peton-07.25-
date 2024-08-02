const exp = require('constants');
const db = require('../db');

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
  db.query('SELECT * FROM noticeboard WHERE post_id = ?', [post_id], (err, results) => {
    if (err) {
      console.error("게시물 조회 중 에러 발생: ", err);
      res.status(500).send('서버 에러');
      return;
    }
    if (results.length === 0) {
      return res.status(404).send('게시물이 존재하지 않습니다.');
    }
    console.log("----------------------------------");
    console.log("user id :", user_id); // 로그인된 user id
    console.log("post user id :", results[0].user_id); // 게시글의 user id
    console.log(user_id == results[0].user_id); // 로그인된 user id와 게시글의 user id 비교
    // console.log("상세 페이지의 글 post_id :", results[0].post_id);

    res.render('noticeboard/detail', { post: results[0] });
  });
};

// 게시물을 삭제하는 서비스 함수
exports.deletePost = (req, res) => {
  const post_id = req.params.post_id;
  db.query('DELETE FROM noticeboard WHERE post_id = ?', [post_id], (err, result) => {
    if (err) {
      console.error('게시글 삭제 중 에러 발생:', err);
      return res.status(500).send('서버 에러');
    }
    res.redirect('/noticeboard');
  });
};

exports.getEditDetail = (req, res) => {
  const user_id = req.session.userid;
  const post_id = req.params.post_id;
  db.query(`SELECT * FROM noticeboard WHERE post_id = ${post_id}`, (err, results) => {
    if (err) {
      console.error("게시물 조회 중 에러 발생: ", err);
      res.status(500).send('서버 에러');
      return;
    }
    if (results.length === 0) {
      return res.status(404).send('게시물이 존재하지 않습니다.');
    }
    res.render('noticeboard/edit', { post: results[0] });
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
    res.redirect(`/noticeboard/${post_id}`);
  });
};
