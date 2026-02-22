import { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { TextDisplay } from './components/TextDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { uploadImage } from './api/ocr';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = async (file) => {
    setError(null);
    setImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Start OCR processing
    try {
      setLoading(true);
      const response = await uploadImage(file);
      setExtractedText(response.data.text);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
            <h1 className="text-4xl font-bold text-gray-900">IMG to TXT</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Extract text from images using advanced OCR technology
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Upload Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Upload Image</h2>
            <ImageUploader
              onImageSelect={handleImageSelect}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                <span className="font-semibold">Error:</span> {error}
              </p>
            </div>
          )}

          {/* Preview and Results */}
          {imagePreview && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Image Preview
                </h3>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                {image && (
                  <p className="text-sm text-gray-600">
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
                    <TextDisplay
                      text={extractedText}
                      onTextChange={setExtractedText}
                    />
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
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Reset
              </button>
              {extractedText && (
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    extractedText
                  )}`}
                  download="extracted-text.txt"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Download Text
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>
            Built with React, Vite, Tailwind CSS, Express, and Tesseract.js
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
