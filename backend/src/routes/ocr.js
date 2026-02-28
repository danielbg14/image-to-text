import express from 'express';
import fs from 'fs';
import path from 'path';
import { upload } from '../middleware/fileUpload.js';
import { extractTextFromImage } from '../utils/ocr.js';
import { getAvailableLanguages } from '../utils/languages.js';

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

    // language can be sent from the client via form data
    // grab provided lang and normalize
    let lang = req.body.lang || req.body.language || 'eng+bul';
    if (lang) {
      lang = decodeURIComponent(lang);
      // some parsers convert '+' to space; normalize anyway
      lang = lang.replace(/ /g, '+');
    }
    console.log('Request body:', req.body);
    console.log(`Using OCR language: ${lang}`);
    const ocrResult = await extractTextFromImage(req.file.path, lang);

    // Clean up uploaded file after processing
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    // if auto-detect produced a `detected` value, use that for response lang
    const responseLang = ocrResult.detected || lang;

    res.json({
      success: true,
      data: {
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        fileName: req.file.originalname,
        lang: responseLang, // language actually processed/detected
        detected: ocrResult.detected || null,
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

// list available OCR languages based on traineddata files
router.get('/languages', (req, res) => {
  const langs = getAvailableLanguages();
  res.json({ success: true, data: langs });
});

export default router;
