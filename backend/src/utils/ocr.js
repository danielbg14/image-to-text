import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imagePath) => {
  try {
    const result = await Tesseract.recognize(imagePath, 'eng+bul', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const text = result.data.text;

    return {
      success: true,
      text: text.trim(),
      confidence: result.data.confidence,
    };
  } catch (error) {
    throw new Error(`OCR processing failed: ${error.message}`);
  }
};