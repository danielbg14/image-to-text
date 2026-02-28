import Tesseract from 'tesseract.js';
import * as franc from 'franc';
import { getAvailableLanguages } from './languages.js';


export const extractTextFromImage = async (imagePath, lang = 'eng+bul') => {
  try {
    // if auto-detect requested, perform a preliminary OCR and use franc
    if (lang === 'auto') {
      const available = getAvailableLanguages().map((l) => l.code);
      const allLangs = available.join('+') || 'eng';

      console.log(`Running initial OCR for auto-detect with: ${allLangs}`);
      const sampleResult = await Tesseract.recognize(imagePath, allLangs, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress (sample): ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      const sampleText = sampleResult.data.text.slice(0, 2000);
      let guessed = franc.default(sampleText, { whitelist: available });
      if (guessed === 'und' || !available.includes(guessed)) {
        guessed = allLangs;
      }
      console.log(`franc guessed: ${guessed}`);

      let finalResult = sampleResult;
      if (guessed && guessed !== allLangs) {
        finalResult = await Tesseract.recognize(imagePath, guessed, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress (final): ${Math.round(m.progress * 100)}%`);
            }
          },
        });
      }

      const text = finalResult.data.text;
      return {
        success: true,
        text: text.trim(),
        confidence: finalResult.data.confidence,
        detected: guessed,
      };
    }

    // allow caller to specify tesseract language(s)
    const result = await Tesseract.recognize(imagePath, lang, {
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