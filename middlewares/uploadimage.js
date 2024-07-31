const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Google Cloud Storage 설정
const storage = new Storage({
  projectId: 'peton-429909',
  keyFilename: 'path/to/peton-429909-22814645d828.json'
});

const bucketName = 'peton_bucket';
const bucket = storage.bucket(bucketName);

// Multer 설정
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

module.exports = upload;
