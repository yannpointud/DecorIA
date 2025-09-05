import { GEMINI_API_KEY } from '@env';

export const API_CONFIG = {
  GEMINI_API_KEY: GEMINI_API_KEY || 'YOUR_API_KEY_HERE', // À remplacer
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent',
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_IMAGE_SIZE: 4 * 1024 * 1024, // 4MB
};

export const IMAGE_CONFIG = {
  COMPRESSION_QUALITY: 0.7,
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
  OUTPUT_FORMAT: 'jpeg' as const,
};
