const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const noticeboardService = require('../services/noticeboardService');

router.get('/noticeboard', noticeboardService.getNoticeboard);


router.get('/noticeboard/form', (req, res) => {
    res.render('noticeboard/form'); 
});

router.post('/form', noticeboardService.createPost);

module.exports = router;