
import { useState, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import geminiService from '../services/geminiService';
import imageService from '../services/imageService';
import storageService from '../services/storageService';
import { TransformationStyle } from '../constants/styles';

export const useImageTransform = () => {
  const {
    originalImage,
    selectedStyle,
    customPrompt,
    clearCustomPrompt,
    setTransformedImage,
    setIsLoading,
    setLoadingProgress,
    setError,
  } = useAppContext();

  const [isProcessing, setIsProcessing] = useState(false);

  const transformImage = useCallback(async (overrideStyle?: TransformationStyle, overridePrompt?: string) => {
    const effectiveSelectedStyle = overrideStyle || selectedStyle;
    const effectiveCustomPrompt = overridePrompt || customPrompt;
    
    if (!originalImage || !effectiveSelectedStyle) {
      setError('Image ou style manquant');
      return false;
    }

    setIsProcessing(true);
    setIsLoading(true);
    setLoadingProgress(0);
    setError(null);

    try {
      // Utiliser le prompt personnalisé si défini, sinon le prompt du style
      const effectiveStyle = effectiveCustomPrompt && effectiveSelectedStyle?.id === 'custom'
        ? { ...effectiveSelectedStyle, prompt: effectiveCustomPrompt }
        : effectiveSelectedStyle;

      // Transformation via Gemini
      const transformedUri = await geminiService.transformImage(
        originalImage,
        effectiveStyle!,
        (progress) => setLoadingProgress(progress)
      );

      // Si c'est du base64, convertir en URI locale (seulement sur mobile)
      let finalUri = transformedUri;
      if (transformedUri.startsWith('data:image') && typeof window === 'undefined') {
        // Seulement sur mobile - sur web on peut utiliser directement les data URIs
        finalUri = await imageService.base64ToUri(transformedUri);
      }

      // Optimiser pour l'affichage (seulement sur mobile)
      let optimizedUri = finalUri;
      if (typeof window === 'undefined') {
        optimizedUri = await imageService.optimizeImageForDisplay(finalUri);
      }
      
      setTransformedImage(optimizedUri);

      // Sauvegarder dans l'historique (seulement sur mobile, pas sur web à cause des quotas)
      if (typeof window === 'undefined') {
        await storageService.saveTransformation(
          originalImage,
          optimizedUri,
          selectedStyle.id
        );
      }

      setLoadingProgress(1);
      
      // Nettoyer le prompt personnalisé après une transformation réussie
      if (effectiveCustomPrompt && effectiveSelectedStyle?.id === 'custom') {
        clearCustomPrompt();
      }
      
      return true;
    } catch (error) {
      console.error('Transform error:', error);
      setError(error instanceof Error ? error.message : 'Erreur de transformation');
      return false;
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  }, [originalImage, selectedStyle, customPrompt, clearCustomPrompt, setTransformedImage, setIsLoading, setLoadingProgress, setError]);

  const mockTransform = useCallback(async (overrideStyle?: TransformationStyle, overridePrompt?: string) => {
    const effectiveSelectedStyle = overrideStyle || selectedStyle;
    const effectiveCustomPrompt = overridePrompt || customPrompt;
    
    if (!effectiveSelectedStyle) return false;

    console.log('Mock transform started'); // Debug
    setIsProcessing(true);
    setIsLoading(true);
    setLoadingProgress(0);

    try {
      // Utiliser le prompt personnalisé si défini, sinon le prompt du style
      const effectiveStyle = effectiveCustomPrompt && effectiveSelectedStyle?.id === 'custom'
        ? { ...effectiveSelectedStyle, prompt: effectiveCustomPrompt }
        : effectiveSelectedStyle;

      console.log('Calling gemini mock service...'); // Debug
      const mockUri = await geminiService.mockTransform(effectiveStyle);
      console.log('Mock URI received:', mockUri); // Debug
      
      // Pas d'optimisation pour le mock, juste l'URL directe
      setTransformedImage(mockUri);
      setLoadingProgress(1);
      
      // Nettoyer le prompt personnalisé après une transformation réussie
      if (effectiveCustomPrompt && effectiveSelectedStyle?.id === 'custom') {
        clearCustomPrompt();
      }
      
      console.log('Mock transform completed'); // Debug
      return true;
    } catch (error) {
      console.error('Mock transform error:', error); // Debug
      setError('Erreur lors du test');
      return false;
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
      console.log('Mock transform cleanup done'); // Debug
    }
  }, [selectedStyle, customPrompt, clearCustomPrompt, setTransformedImage, setIsLoading, setLoadingProgress, setError]);

  return {
    transformImage,
    mockTransform,
    isProcessing,
  };
};