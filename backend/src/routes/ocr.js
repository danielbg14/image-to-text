import express from 'express';
import fs from 'fs';
import path from 'path';
import { upload } from '../middleware/fileUpload.js';
import { extractTextFromImage } from '../utils/ocr.js';

const router = express.Router();

router.post('/extract', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided',
      });
    }

    console.log(`Processing image: ${req.file.filename}`);

    const ocrResult = await extractTextFromImage(req.file.path);

    // Clean up uploaded file after processing
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    res.json({
      success: true,
      data: {
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        fileName: req.file.originalname,
      },
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    next(error);
  }
});

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
