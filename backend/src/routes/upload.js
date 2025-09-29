// backend/src/routes/upload.js
import express from 'express';
import multer from 'multer';
import { uploadFile, getSignedUrl, deleteFile } from '../controllers/uploadController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Configure Multer to store files in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and Office documents are allowed.'));
    }
  }
});

// Upload file endpoint
router.post('/', authMiddleware, upload.single('file'), uploadFile);

// Get signed URL for file - use regex to match everything after /signed-url/
router.get(/^\/signed-url\/(.+)/, authMiddleware, getSignedUrl);

// Delete file - use regex to match everything after /
router.delete(/^\/(.+)/, authMiddleware, deleteFile);

export default router;