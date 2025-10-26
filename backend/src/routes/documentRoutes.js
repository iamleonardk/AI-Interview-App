const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  uploadDocument,
  listDocuments,
  deleteDocument,
  checkDocuments
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for temporary file storage (will upload to Cloudinary)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit (Cloudinary supports larger files)
  }
});

// Create temporary uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads/temp')) {
  fs.mkdirSync('uploads/temp', { recursive: true });
}

// Add logging middleware before upload
router.post('/upload', protect, (req, res, next) => {
  console.log('Upload request received');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);
  next();
}, upload.single('file'), (req, res, next) => {
  if (req.file) {
    console.log('File received by multer:');
    console.log('- Filename:', req.file.filename);
    console.log('- Original name:', req.file.originalname);
    console.log('- Size:', req.file.size);
    console.log('- Mimetype:', req.file.mimetype);
    console.log('- Path:', req.file.path);
  } else {
    console.log('No file received by multer');
  }
  next();
}, uploadDocument);
router.get('/list', protect, listDocuments);
router.get('/check', protect, checkDocuments);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
