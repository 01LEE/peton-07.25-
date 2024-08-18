const express = require('express');
const router = express.Router();
const profileService = require('../services/profileService');
const { multer, uploadPetImage } = require('../middlewares/uploadimage');

// 프로필 이미지 업로드 라우트
router.post('/upload', multer.single('profileImage'), profileService.uploadProfileImage);

// 반려동물 이미지 업로드 라우트
router.post('/petupload', multer.single('petImage'), uploadPetImage, profileService.updatePetImage);

module.exports = router;
