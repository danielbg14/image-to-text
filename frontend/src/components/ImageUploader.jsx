import { useEffect } from 'react';
import { useTranslation } from '../i18n.jsx';

export const ImageUploader = ({ onImageSelect, isDragging, setIsDragging }) => {
  const { t } = useTranslation();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        onImageSelect(file);
      } else {
        alert(t('invalidImageType'));
      }
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        if (['image/jpeg', 'image/png', 'image/jpg'].includes(item.type)) {
          const file = item.getAsFile();
          if (file) {
            onImageSelect(file);
          }
        } else {
          alert(t('invalidPasteType'));
        }
        return;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
          : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
      }`}
    >
      <input
        type="file"
        onChange={handleFileInput}
        accept=".jpg,.jpeg,.png"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="space-y-2">
        <svg
          className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {t('dragDrop')}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-300">{t('browse')}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">{t('paste')}</p>
      </div>
    </div>
  );
};