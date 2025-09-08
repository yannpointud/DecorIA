import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

interface OrientationState {
  dimensions: {
    width: number;
    height: number;
  };
  isLandscape: boolean;
}

export const useOrientation = (): OrientationState => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => {
      subscription?.remove();
    };
  }, []);
  
  const isLandscape = dimensions.width > dimensions.height;
  
  return {
    dimensions,
    isLandscape,
  };
};