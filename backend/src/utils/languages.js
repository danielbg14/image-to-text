import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// traineddata files are expected to live either in the backend root (one level up from src)
// or inside a dedicated "languages" subdirectory.  This allows keeping them organized.
const rootDir = path.join(__dirname, '../');
const languagesDir = path.join(rootDir, 'languages');

// human-readable names for a few common codes; fall back to code if unknown
const languageNames = {
  bul: 'Bulgarian',
  deu: 'German',
  eng: 'English',
  fra: 'French',
  spa: 'Spanish',
  ita: 'Italian',
  por: 'Portuguese',
  rus: 'Russian',
  // add more mappings as needed
};

export const getAvailableLanguages = () => {
  try {
    // gather candidates from both root and languages subdirectory
    const paths = [rootDir];
    if (fs.existsSync(languagesDir)) paths.push(languagesDir);

    const langs = [];
    for (const dir of paths) {
      const files = fs.readdirSync(dir);
      files
        .filter((f) => f.endsWith('.traineddata'))
        .forEach((f) => {
          const code = path.basename(f, '.traineddata');
          // avoid duplicates if same code exists in both places
          if (!langs.some((l) => l.code === code)) {
            langs.push({ code, name: languageNames[code] || code });
          }
        });
    }
    // Sort languages alphabetically by name
    langs.sort((a, b) => a.name.localeCompare(b.name));
    return langs;
  } catch (err) {
    console.error('Error reading traineddata directory', err);
    return [];
  }
};
