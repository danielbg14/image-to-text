import { useState, useEffect } from 'react';
import { fetchLanguages, uploadImage } from './api/ocr';
import { ImageUploader } from './components/ImageUploader';
import { TextDisplay } from './components/TextDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import './App.css';
import { useTranslation } from './i18n.jsx';

// simple theme toggle hook

function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  // languages retrieved from backend (code/name pairs)
  const [languages, setLanguages] = useState([]);
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [autoDetect, setAutoDetect] = useState(false);
  const [serverLang, setServerLang] = useState('');

  const [darkMode, setDarkMode] = useState(false);
  const [localeTransition, setLocaleTransition] = useState(false);
  const { t, locale, setLocale } = useTranslation();
  const [uiLang, setUiLang] = useState(locale);

  // initialize theme based on preference or saved value
  useEffect(() => {
    // load available OCR languages from backend
    fetchLanguages()
      .then((data) => {
        setLanguages(data);
        setSelectedLangs((prev) => {
          const filtered = prev.filter((c) => data.some((l) => l.code === c));
          if (filtered.length > 0) return filtered;
          // if both english and bulgarian are available, default to both
          const codes = data.map((l) => l.code);
          if (codes.includes('eng') && codes.includes('bul')) {
            return ['eng', 'bul'];
          }
          if (data.length) return [data[0].code];
          return [];
        });
      })
      .catch((err) => {
        // Fallback languages if backend is unavailable
        const fallbackLanguages = [
          { code: 'bul', name: 'Bulgarian' },
          { code: 'eng', name: 'English' },
          { code: 'fra', name: 'French' },
          { code: 'deu', name: 'German' },
          { code: 'ita', name: 'Italian' },
          { code: 'por', name: 'Portuguese' },
          { code: 'rus', name: 'Russian' },
          { code: 'spa', name: 'Spanish' },
        ];
        setLanguages(fallbackLanguages);
        setSelectedLangs(['eng', 'bul']);
      });

    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      const value = saved === 'true';
      setDarkMode(value);
      document.documentElement.classList.toggle('dark', value);
    } else {
      const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefers);
      document.documentElement.classList.toggle('dark', prefers);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('darkMode', next);
      return next;
    });
  };

  const handleImageSelect = async (file) => {
    setError(null);
    setImage(file);
    let langToUse;
    if (autoDetect) {
      langToUse = 'auto';
      console.log('Auto-detect enabled, sending lang=auto');
    } else {
      // compute language string by inspecting DOM checkboxes to avoid stale state
      const checkboxEls = document.querySelectorAll('input[name="ocr-lang"]');
      const langs = [];
      checkboxEls.forEach((el) => {
        if (el.checked && el.value) langs.push(el.value);
      });
      // fall back to selectedLangs in case DOM query fails
      if (langs.length === 0 && selectedLangs.length > 0) {
        langs.push(...selectedLangs);
      }
      if (langs.length === 0) langs.push('eng');
      langToUse = langs.join('+');
      console.log('Selected OCR languages array (DOM):', langs);
      console.log('Sending language string:', langToUse);
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Start OCR processing
    try {
      setLoading(true);
      const response = await uploadImage(file, langToUse);
      setExtractedText(response.data.text);
      setServerLang(response.data.lang || '');
    } catch (err) {
      setError(err.message);
      console.error('OCR Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImagePreview(null);
    setExtractedText('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-1000">
      <div className="max-w-4xl mx-auto" style={{ opacity: localeTransition ? 0.5 : 1, transition: 'opacity 150ms ease-in-out' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <svg
                className="w-10 h-10 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
              <select
                value={uiLang}
                onChange={(e) => {
                  const newLang = e.target.value;
                  setLocaleTransition(true);
                  setUiLang(newLang);
                  setTimeout(() => {
                    setLocale(newLang);
                    setLocaleTransition(false);
                  }, 150);
                }}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="en">English</option>
                <option value="bg">Български</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="ru">Русский</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
          <p className="text-gray-600 text-lg dark:text-gray-400">
            {t('description')}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8 transition-colors duration-300">
          {/* Upload Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('uploadImage')}</h2>
            {/* language selector (checkbox list) */}
            <div className="flex flex-col space-y-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoDetect}
                  onChange={(e) => setAutoDetect(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {t('autoDetect')}
                </span>
              </label>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {t('ocrLanguages')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {languages.map((lang) => (
                  <label
                    key={lang.code}
                    className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm sm:text-base"
                  >
                    <input
                      type="checkbox"
                      name="ocr-lang"
                      value={lang.code}
                      checked={selectedLangs.includes(lang.code)}
                      disabled={autoDetect}
                      onChange={(e) => {
                        const code = e.target.value;
                        setSelectedLangs((prev) => {
                          if (prev.includes(code)) {
                            return prev.filter((c) => c !== code);
                          }
                          return [...prev, code];
                        });
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    {lang.name}
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {autoDetect
                  ? t('currentSelection') + ' auto'
                  : t('currentSelection') + ' ' + (selectedLangs.join('+') || t('title'))}
              </p>
            </div>
            <ImageUploader
              onImageSelect={handleImageSelect}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">
                <span className="font-semibold">{t('errorPrefix')}</span> {error}
              </p>
            </div>
          )}

          {/* Preview and Results */}
          {imagePreview && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('imagePreview')}
                </h3>
                <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                {image && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    📄 {image.name} ({(image.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Loading or Text Results */}
              <div className="space-y-4">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  extractedText && (
                    <>
                      {autoDetect && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('autoDetected')} <span className="font-semibold">{languages.find(l=>l.code===serverLang)?.name || serverLang}</span>
                        </p>
                      )}
                      {!autoDetect && (
                        <>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('ocrLanguageRequested')} <span className="font-semibold">{selectedLangs.map(c=>languages.find(l=>l.code===c)?.name||c).join('+') || 'English'}</span>
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('ocrLanguageProcessed')} <span className="font-semibold">{languages.find(l=>l.code===serverLang)?.name || serverLang}</span>
                          </p>
                        </>
                      )}
                      <TextDisplay
                        text={extractedText}
                        onTextChange={setExtractedText}
                      />
                    </>
                  )
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {imagePreview && !loading && (
            <div className="flex gap-4 justify-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                {t('reset')}
              </button>
              {extractedText && (
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    extractedText
                  )}`}
                  download="extracted-text.txt"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  {t('downloadText')}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 dark:text-gray-400 text-sm">
          <p>
            {t('builtWith')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
