// routes/profileRouter.js
const express = require('express');
const router = express.Router();
const profileService = require('../services/profileService');
const myinfoService = require('../services/myinfoService');
router.get('/upload', (req, res) => {
    res.render('upload');
});
router.post('/upload', profileService.multer.single('profileImage'), profileService.uploadProfileImage);

router.get('/petupload', (req,res) => {
    res.render('/petupload');
})
router.post('/petupload', profileService.multer.single('petImage'), profileService.uploadPetImage, myinfoService.updateaddpet);

module.exports = router;
