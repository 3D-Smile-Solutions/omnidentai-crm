// backend/src/routes/practiceDocumentRoutes.js
import express from 'express';
import multer from 'multer';
import { 
  uploadPracticeDocument, 
  getPracticeDocuments,
  getDocumentById,
  deletePracticeDocument 
} from '../controllers/practiceDocumentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.post('/upload', authMiddleware, upload.single('file'), uploadPracticeDocument);
router.get('/', authMiddleware, getPracticeDocuments);
router.get('/:documentId', authMiddleware, getDocumentById); // ✅ NEW: Get single document with fresh URL
router.delete('/:documentId', authMiddleware, deletePracticeDocument);

export default router;