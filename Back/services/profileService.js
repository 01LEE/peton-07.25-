const { Storage } = require('@google-cloud/storage');
const path = require('path');
const Multer = require('multer');
const db = require('../db');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../peton-429909-72f4cd54bf9a.json'),
  projectId: 'peton-429909',
});

const bucketName = 'peton_bucket';
const bucket = storage.bucket(bucketName);

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 파일 크기 제한 (5MB)
  },
});

const uploadProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const userId = req.session.userid;
  const blob = bucket.file(`profileImages/${userId}/${Date.now()}_${req.file.originalname}`);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => {
    console.error('Error uploading to Cloud Storage:', err);
    return res.status(500).json({ success: false, message: 'Error uploading to Cloud Storage.' });
  });

  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    const query = 'INSERT INTO user (user_id, profile_image_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE profile_image_url = VALUES(profile_image_url)';

    db.query(query, [userId, publicUrl], (err, result) => {
      if (err) {
        console.error('Error saving image URL to database:', err);
        return res.status(500).json({ success: false, message: 'Database error.' });
      }
      res.json({ success: true, message: 'Profile image updated successfully.', imageUrl: publicUrl });
    });
  });

  blobStream.end(req.file.buffer);
};

const updatePetImage = async (req, res) => {
  const userId = req.session.userid;
  const petId = req.body.pet_id; // body에서 pet_id를 가져옴
  const petImageUrl = req.body.pet_image_url; // 이전 미들웨어에서 설정한 이미지 URL

  if (!petId || !petImageUrl) {
    return res.status(400).json({ success: false, message: 'Invalid pet_id or pet_image_url.' });
  }

  const query = 'UPDATE pet SET pet_image_url = ? WHERE pet_id = ? AND user_id = ?';

  db.query(query, [petImageUrl, petId, userId], (err, result) => {
    if (err) {
      console.error('Error updating pet image in the database:', err);
      return res.status(500).json({ success: false, message: 'Database error.' });
    }
    res.json({ success: true, message: 'Pet image updated successfully.', imageUrl: petImageUrl });
  });
};

module.exports = {
  multer,
  uploadProfileImage,
  updatePetImage,
};