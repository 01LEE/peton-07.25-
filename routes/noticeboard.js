const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const isYoursNoticeboard = require('../middlewares/isYoursNoticeboard');
const noticeboardService = require('../services/noticeboardService');
const { not } = require('ip');

// GET 요청: 게시판 목록을 렌더링
router.get('/noticeboard', noticeboardService.getNoticeboard);

// GET 요청: 게시글 작성 폼을 렌더링
router.get('/noticeboard/form',isAuthenticated, (req, res) => {
    res.render('noticeboard/form'); // 작성 폼 렌더링
});

// POST 요청: 새 게시글을 데이터베이스에 저장
router.post('/form', isAuthenticated, noticeboardService.createPost); 

// GET 요청: 게시물 상세 페이지를 렌더링
router.get('/noticeboard/:post_id', noticeboardService.getPostDetail);

// DELETE 요청: 게시물 삭제를 데이터 베이스에 저장
router.post('/noticeboard/delete/:post_id', isAuthenticated, noticeboardService.deletePost);

// GET 요청: 게시글 수정 폼을 렌더링
router.get('/noticeboard/edit/:post_id', isAuthenticated, noticeboardService.getEditDetail);

// POST 요청: 수정된 게시글을 데이터베이스에 저장
router.post('/noticeboard/edit/:post_id',isAuthenticated, noticeboardService.editPost);

// POST 요청: 댓글 추가
router.post('/noticeboard/comment/:post_id', isAuthenticated, noticeboardService.addComment);

// 댓글 삭제
router.post('/noticeboard/comment/delete/:comment_id/:post_id', isAuthenticated, noticeboardService.deleteComment);

// 댓글 수정
router.post('/noticeboard/comment/edit/:comment_id/:post_id', isAuthenticated, noticeboardService.editComment);

module.exports = router;