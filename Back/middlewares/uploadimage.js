const { Storage } = require('@google-cloud/storage');
const path = require('path');
const Multer = require('multer');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../peton-429909-72f4cd54bf9a.json'),
  projectId: 'peton-429909',
});

const bucketName = 'peton_bucket';
const bucket = storage.bucket(bucketName);

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 최대 파일 크기 설정 (5MB)
  },
});

const uploadPetImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const userId = req.session.userid;
  if (!userId) {
    return res.status(400).send('User not logged in.');
  }

  const petId = req.body.pet_id; // 반려견 ID를 req.body에서 가져옴
  console.log('Received pet_id:', petId); // 디버깅을 위한 로그

  if (!petId) {
    return res.status(400).json({ success: false, message: 'pet_id가 누락되었습니다.' });
  }

  const blob = bucket.file(`petImages/${userId}/${petId}_${Date.now()}_${encodeURIComponent(req.file.originalname)}`);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => {
    console.error('Error uploading to Cloud Storage:', err);
    return res.status(500).send('Error uploading to Cloud Storage.');
  });

  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
    req.body.pet_image_url = publicUrl;
    next(); // 이미지 업로드 후 다음 미들웨어로 넘어감
  });

  blobStream.end(req.file.buffer);
};

module.exports = {
  multer,
  uploadPetImage,
};
