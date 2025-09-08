
import { useState, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TransformationStyle } from '../constants/styles';

export const useImageTransform = () => {
  const {
    transformImage: contextTransformImage,
    mockTransform: contextMockTransform,
    isLoading,
  } = useAppContext();

  const [isProcessing, setIsProcessing] = useState(false);

  const transformImage = useCallback(async (overrideStyle?: TransformationStyle, overridePrompt?: string) => {
    setIsProcessing(true);
    try {
      const result = await contextTransformImage(overrideStyle, overridePrompt);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [contextTransformImage]);

  const mockTransform = useCallback(async (overrideStyle?: TransformationStyle, overridePrompt?: string) => {
    setIsProcessing(true);
    try {
      const result = await contextMockTransform(overrideStyle, overridePrompt);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [contextMockTransform]);

  return {
    transformImage,
    mockTransform,
    isProcessing: isProcessing || isLoading,
  };
};