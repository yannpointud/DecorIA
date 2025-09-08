import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TransformationStyle } from '../constants/styles';

interface AppState {
  originalImage: string | null;
  transformedImage: string | null;
  selectedStyle: TransformationStyle | null;
  captureAspectRatio: string | null;
  isLoading: boolean;
  loadingProgress: number;
  error: string | null;
  customPrompt: string | null;
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
    setState(initialState);
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