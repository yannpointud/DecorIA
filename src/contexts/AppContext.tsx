import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { TransformationStyle } from '../constants/styles';
import geminiService from '../services/geminiService';
import imageService from '../services/imageService';
import storageService from '../services/storageService';

interface AppState {
  originalImage: string | null;
  transformedImage: string | null;
  selectedStyle: TransformationStyle | null;
  captureAspectRatio: string | null;
  isLoading: boolean;
  loadingProgress: number;
  error: string | null;
  customPrompt: string | null;
  lastTransformationParams: {
    style: TransformationStyle;
    customPrompt: string | null;
  } | null;
}

interface AppContextType extends AppState {
  setOriginalImage: (uri: string | null) => void;
  setTransformedImage: (uri: string | null) => void;
  setSelectedStyle: (style: TransformationStyle | null) => void;
  setCaptureAspectRatio: (ratio: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setCustomPrompt: (prompt: string | null) => void;
  clearCustomPrompt: () => void;
  resetState: () => void;
  transformImage: (overrideStyle?: TransformationStyle, overridePrompt?: string) => Promise<boolean>;
  retryTransformation: () => Promise<boolean>;
  mockTransform: (overrideStyle?: TransformationStyle, overridePrompt?: string) => Promise<boolean>;
}

const initialState: AppState = {
  originalImage: null,
  transformedImage: null,
  selectedStyle: null,
  captureAspectRatio: null,
  isLoading: false,
  loadingProgress: 0,
  error: null,
  customPrompt: null,
  lastTransformationParams: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setOriginalImage = (uri: string | null) => {
    setState(prev => ({ ...prev, originalImage: uri, transformedImage: null }));
  };

  const setTransformedImage = (uri: string | null) => {
    setState(prev => ({ ...prev, transformedImage: uri }));
  };

  const setSelectedStyle = (style: TransformationStyle | null) => {
    setState(prev => ({ ...prev, selectedStyle: style }));
  };

  const setCaptureAspectRatio = (ratio: string | null) => {
    setState(prev => ({ ...prev, captureAspectRatio: ratio }));
  };

  const setIsLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading, error: null }));
  };

  const setLoadingProgress = (progress: number) => {
    setState(prev => ({ ...prev, loadingProgress: progress }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  };

  const setCustomPrompt = (prompt: string | null) => {
    setState(prev => ({ ...prev, customPrompt: prompt }));
  };

  const clearCustomPrompt = () => {
    setState(prev => ({ ...prev, customPrompt: null }));
  };

  const resetState = () => {
    // Conserver le prompt personnalisé et les derniers paramètres lors du reset
    const currentCustomPrompt = state.customPrompt;
    const currentLastParams = state.lastTransformationParams;
    setState({ 
      ...initialState, 
      customPrompt: currentCustomPrompt,
      lastTransformationParams: currentLastParams
    });
  };

  const transformImage = async (overrideStyle?: TransformationStyle, overridePrompt?: string): Promise<boolean> => {
    const effectiveSelectedStyle = overrideStyle || state.selectedStyle;
    const effectiveCustomPrompt = overridePrompt || state.customPrompt;
    
    if (!state.originalImage || !effectiveSelectedStyle) {
      setError('Image ou style manquant');
      return false;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    setError(null);

    // Sauvegarder les paramètres de transformation pour le retry
    setState(prev => ({ 
      ...prev, 
      lastTransformationParams: {
        style: effectiveSelectedStyle,
        customPrompt: effectiveCustomPrompt
      }
    }));

    try {
      // Utiliser le prompt personnalisé si défini, sinon le prompt du style
      const effectiveStyle = effectiveCustomPrompt && effectiveSelectedStyle?.id === 'custom'
        ? { ...effectiveSelectedStyle, prompt: effectiveCustomPrompt }
        : effectiveSelectedStyle;

      // Transformation via Gemini
      const transformedUri = await geminiService.transformImage(
        state.originalImage,
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
          state.originalImage,
          optimizedUri,
          effectiveSelectedStyle.id
        );
      }

      setLoadingProgress(1);
      
      // Le prompt personnalisé est conservé pour les prochaines transformations
      
      return true;
    } catch (error) {
      console.error('Transform error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur de transformation';
      setError(errorMessage);
      
      // Afficher Alert pour les erreurs répertoriées
      if (error instanceof Error) {
        Alert.alert('Erreur', error.message);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const retryTransformation = async (): Promise<boolean> => {
    // Vérifier qu'on a une image originale
    if (!state.originalImage) {
      const errorMsg = 'Impossible de relancer : image originale manquante';
      setError(errorMsg);
      Alert.alert('Erreur', errorMsg);
      return false;
    }

    // Utiliser les derniers paramètres sauvegardés si disponibles, sinon utiliser l'état actuel
    const paramsToUse = state.lastTransformationParams || {
      style: state.selectedStyle,
      customPrompt: state.customPrompt
    };

    if (!paramsToUse.style) {
      const errorMsg = 'Impossible de relancer : aucun style de transformation';
      setError(errorMsg);
      Alert.alert('Erreur', errorMsg);
      return false;
    }
    
    console.log('Retry with saved params:', paramsToUse);
    return await transformImage(paramsToUse.style, paramsToUse.customPrompt || undefined);
  };

  const mockTransform = async (overrideStyle?: TransformationStyle, overridePrompt?: string): Promise<boolean> => {
    const effectiveSelectedStyle = overrideStyle || state.selectedStyle;
    const effectiveCustomPrompt = overridePrompt || state.customPrompt;
    
    if (!effectiveSelectedStyle) return false;

    console.log('Mock transform started');
    setIsLoading(true);
    setLoadingProgress(0);

    // Sauvegarder les paramètres de transformation pour le retry
    setState(prev => ({ 
      ...prev, 
      lastTransformationParams: {
        style: effectiveSelectedStyle,
        customPrompt: effectiveCustomPrompt
      }
    }));

    try {
      // Utiliser le prompt personnalisé si défini, sinon le prompt du style
      const effectiveStyle = effectiveCustomPrompt && effectiveSelectedStyle?.id === 'custom'
        ? { ...effectiveSelectedStyle, prompt: effectiveCustomPrompt }
        : effectiveSelectedStyle;

      console.log('Calling gemini mock service...');
      const mockUri = await geminiService.mockTransform(effectiveStyle);
      console.log('Mock URI received:', mockUri);
      
      // Pas d'optimisation pour le mock, juste l'URL directe
      setTransformedImage(mockUri);
      setLoadingProgress(1);
      
      // Le prompt personnalisé est conservé pour les prochaines transformations
      
      console.log('Mock transform completed');
      return true;
    } catch (error) {
      console.error('Mock transform error:', error);
      setError('Erreur lors du test');
      return false;
    } finally {
      setIsLoading(false);
      console.log('Mock transform cleanup done');
    }
  };

  const value: AppContextType = {
    ...state,
    setOriginalImage,
    setTransformedImage,
    setSelectedStyle,
    setCaptureAspectRatio,
    setIsLoading,
    setLoadingProgress,
    setError,
    setCustomPrompt,
    clearCustomPrompt,
    resetState,
    transformImage,
    retryTransformation,
    mockTransform,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};