const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchLanguages = async () => {
  const response = await fetch(`${API_URL}/api/ocr/languages`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch languages');
  }
  const result = await response.json();
  return result.data;
};

export const uploadImage = async (file, lang = 'eng') => {
  const formData = new FormData();
  formData.append('image', file);
  // encode to preserve plus signs
  formData.append('lang', encodeURIComponent(lang));

  const response = await fetch(`${API_URL}/api/ocr/extract`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to extract text');
  }

  return await response.json();
};
