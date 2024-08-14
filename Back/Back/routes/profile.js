// routes/profileRouter.js
const express = require('express');
const router = express.Router();
const profileService = require('../services/profileService');
const myinfoService = require('../services/myinfoService');
const { multer, uploadPetImage } = require('../middlewares/uploadimage');

router.get('/upload', (req, res) => {
    res.render('upload');
});
router.post('/upload', profileService.multer.single('profileImage'), profileService.uploadProfileImage);

// router.get('/petupload', (req,res) => {
//     res.render('/petupload');
// })
router.post('/petupload', multer.single('petImage'), uploadPetImage, (req, res, next) => {
    console.log('Request Body:', req.body); // 디버깅 로그 추가
    next();
  }, myinfoService.updateaddpet);

  router.post('/updatepetimage/:pet_id', multer.single('petImage'), uploadPetImage, myinfoService.updatePetImage);

  
module.exports = router;
