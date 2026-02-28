import { useTranslation } from '../i18n.jsx';

export const LoadingSpinner = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-600"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium">{t('loadingText1')}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{t('loadingText2')}</p>
    </div>
  );
};
