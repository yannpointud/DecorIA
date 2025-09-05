import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TransformationStyle } from '../constants/styles';

interface AppState {
  originalImage: string | null;
  transformedImage: string | null;
  selectedStyle: TransformationStyle | null;
  isLoading: boolean;
  loadingProgress: number;
  error: string | null;
}

interface AppContextType extends AppState {
  setOriginalImage: (uri: string | null) => void;
  setTransformedImage: (uri: string | null) => void;
  setSelectedStyle: (style: TransformationStyle | null) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

const initialState: AppState = {
  originalImage: null,
  transformedImage: null,
  selectedStyle: null,
  isLoading: false,
  loadingProgress: 0,
  error: null,
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

  const setIsLoading = (loading: boolean) => {
    console.log('setIsLoading called with:', loading);
    setState(prev => ({ ...prev, isLoading: loading, error: null }));
  };

  const setLoadingProgress = (progress: number) => {
    console.log('setLoadingProgress called with:', progress);
    setState(prev => ({ ...prev, loadingProgress: progress }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  };

  const resetState = () => {
    setState(initialState);
  };

  const value: AppContextType = {
    ...state,
    setOriginalImage,
    setTransformedImage,
    setSelectedStyle,
    setIsLoading,
    setLoadingProgress,
    setError,
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