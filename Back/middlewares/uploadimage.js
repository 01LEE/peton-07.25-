const { Storage } = require('@google-cloud/storage');
const path = require('path');
const Multer = require('multer');

// Google Cloud Storage 설정
const storage = new Storage({
  keyFilename: path.join(__dirname, '../peton-429909-72f4cd54bf9a.json'),
  projectId: 'peton-429909',
});

const bucketName = 'peton_bucket';
const bucket = storage.bucket(bucketName);

// Multer 설정 (메모리 저장소 및 파일 크기 제한)
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 최대 파일 크기 설정 (5MB)
  },
});

// 펫 이미지 업로드 미들웨어
const uploadPetImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const userId = req.session.userid;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not logged in.' });
    }

    const petId = req.body.pet_id;
    if (!petId) {
      return res.status(400).json({ success: false, message: 'Missing pet ID.' });
    }

    // Google Cloud Storage에 파일 저장 경로 설정
    const blob = bucket.file(`petImages/${userId}/${petId}_${Date.now()}_${encodeURIComponent(req.file.originalname)}`);
    const blobStream = blob.createWriteStream({
      resumable: false, // 업로드 중단 및 재시작 지원 설정
      contentType: req.file.mimetype, // 파일 MIME 타입 설정
    });

    // 스트림 오류 처리
    blobStream.on('error', err => {
      console.error('Error uploading to Cloud Storage:', err);
      return res.status(500).json({ success: false, message: 'Error uploading to Cloud Storage.' });
    });

    // 스트림 완료 후 처리
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      req.body.pet_image_url = publicUrl; // 이미지 URL을 요청 바디에 추가
      next(); // 다음 미들웨어로 이동
    });

    // 파일 데이터를 Google Cloud Storage에 전송
    blobStream.end(req.file.buffer);

  } catch (error) {
    console.error('Error during upload:', error);
    res.status(500).json({ success: false, message: 'Error during upload.' });
  }
};

module.exports = {
  multer,
  uploadPetImage,
};
