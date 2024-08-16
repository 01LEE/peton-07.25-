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
    fileSize: 5 * 1024 * 1024,
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



const uploadPetImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const userId = req.session.userid;
  console.log('userID :', userId);
  const blob = bucket.file(`petImages/${userId}/${Date.now()}_${req.file.originalname}`);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => {
    console.error('Error uploading to Cloud Storage:', err);
    return res.status(500).send('Error uploading to Cloud Storage.');
  });

  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
    const query = 'INSERT INTO pet (user_id, pet_image_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE pet_image_url = VALUES(pet_image_url)';

    db.query(query, [userId, publicUrl], (err, result) => {
      if (err) {
        console.error('Error saving pet image URL to database:', err);
        return res.status(500).send('Database error.');
      }
      res.redirect('/myinfo');
    });
  });

  blobStream.end(req.file.buffer);
};

module.exports = {
  multer,
  uploadProfileImage,
  uploadPetImage,
};
