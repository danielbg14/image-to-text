import { useTranslation } from '../i18n.jsx';

export const TextDisplay = ({ text, onTextChange }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {t('extractedText')}
        </label>
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
            alert(t('textCopied'));
          }}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {t('copy')}
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full h-64 p-4 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder={t('placeholderText')}
      />
    </div>
  );
};
