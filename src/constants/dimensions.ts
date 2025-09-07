export const IMAGE_DIMENSIONS = {
  // Traitement API - Limite maximale pour économiser data
  MAX_DIMENSION: 1920,
  COMPRESSION: 0.7,
  
  // Preview Mobile - Tailles optimales pour l'affichage
  PREVIEW_MAX_WIDTH: 320,
  PREVIEW_MAX_HEIGHT: 400,
  
  // Logo et UI
  LOGO_SIZE: 240,
  
  // Ratios Standards pour référence
  RATIOS: {
    LANDSCAPE_16_9: 16/9,    // 1.78
    LANDSCAPE_4_3: 4/3,      // 1.33
    SQUARE: 1,               // 1.00
    PORTRAIT_3_4: 3/4,       // 0.75
    PORTRAIT_9_16: 9/16,     // 0.56
  } as const,
  
  // Seuils pour détecter l'orientation
  ORIENTATION_THRESHOLDS: {
    LANDSCAPE: 1.2,   // ratio > 1.2 = paysage
    PORTRAIT: 0.8,    // ratio < 0.8 = portrait
    // Entre 0.8 et 1.2 = carré/quasi-carré
  },
} as const;

// Type helpers
export type ImageOrientation = 'landscape' | 'portrait' | 'square';

// Fonction utilitaire pour déterminer l'orientation
export const getImageOrientation = (width: number, height: number): ImageOrientation => {
  const ratio = width / height;
  
  if (ratio > IMAGE_DIMENSIONS.ORIENTATION_THRESHOLDS.LANDSCAPE) {
    return 'landscape';
  } else if (ratio < IMAGE_DIMENSIONS.ORIENTATION_THRESHOLDS.PORTRAIT) {
    return 'portrait';
  } else {
    return 'square';
  }
};

// Fonction utilitaire pour calculer les dimensions adaptées
export const getAdaptedDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const originalRatio = originalWidth / originalHeight;
  const maxRatio = maxWidth / maxHeight;
  
  let adaptedWidth: number;
  let adaptedHeight: number;
  
  if (originalRatio > maxRatio) {
    // Image plus large que le conteneur → limiter par la largeur
    adaptedWidth = Math.min(originalWidth, maxWidth);
    adaptedHeight = adaptedWidth / originalRatio;
  } else {
    // Image plus haute que le conteneur → limiter par la hauteur
    adaptedHeight = Math.min(originalHeight, maxHeight);
    adaptedWidth = adaptedHeight * originalRatio;
  }
  
  return {
    width: Math.round(adaptedWidth),
    height: Math.round(adaptedHeight),
  };
};