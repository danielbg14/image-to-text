export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds maximum limit (10MB)',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files uploaded',
      });
    }
  }

  if (err.message === 'Only JPEG and PNG images are allowed') {
    return res.status(400).json({
      success: false,
      error: 'Only JPEG and PNG images are allowed',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

import multer from 'multer';
