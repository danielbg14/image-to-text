#!/usr/bin/env node
// Simple script to download tesseract traineddata files into the backend folder.
// Usage: node scripts/download-traineddata.js eng spa fra

import fs from 'fs';
import path from 'path';

const langs = process.argv.slice(2);
if (langs.length === 0) {
  console.error('Please specify one or more language codes (e.g. eng bul spa)');
  process.exit(1);
}

const baseUrl = 'https://github.com/tesseract-ocr/tessdata/raw/main';

(async () => {
  for (const lang of langs) {
    const url = `${baseUrl}/languages/${lang}.traineddata`;
    const dest = path.join(process.cwd(), 'backend', `${lang}.traineddata`);
    console.log(`Downloading ${lang} from ${url}`);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`Saved to ${dest}`);
    } catch (err) {
      console.error(`Failed to download ${lang}:`, err.message);
    }
  }
})();
