
import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  Text,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrientation } from '../hooks/useOrientation';
import { ZoomableImage } from './ZoomableImage';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeImage,
  afterImage,
}) => {
  const { isLandscape, dimensions } = useOrientation();
  const insets = useSafeAreaInsets();

  // Calculer l'espace disponible selon l'orientation
  const getAvailableSpace = () => {
    const { width: screenWidth, height: screenHeight } = dimensions;
    
    // Constantes UI
    const APPBAR_HEIGHT = 56;
    const FAB_CONTAINER_HEIGHT = 100; // FAB + padding
    const PADDING = 16;
    
    let availableWidth = screenWidth - (PADDING * 2);
    let availableHeight;
    
    if (isLandscape) {
      // En paysage : boutons par-dessus l'image, on utilise tout l'écran moins safe areas
      availableHeight = screenHeight - insets.top - insets.bottom - (PADDING * 2);
    } else {
      // En portrait : Appbar + FAB réduisent l'espace (comportement actuel)
      availableHeight = screenHeight - APPBAR_HEIGHT - FAB_CONTAINER_HEIGHT - insets.top - insets.bottom - (PADDING * 2);
    }
    
    console.log(`📐 ImageComparison - Orientation: ${isLandscape ? 'LANDSCAPE' : 'PORTRAIT'}`);
    console.log(`📐 Screen: ${screenWidth}x${screenHeight}`);
    console.log(`📐 Insets: top=${insets.top}, bottom=${insets.bottom}`);
    console.log(`📐 Available: ${availableWidth}x${availableHeight}`);
    
    return {
      maxWidth: Math.max(availableWidth, 200), // Minimum 200px
      maxHeight: Math.max(availableHeight, 200), // Minimum 200px
    };
  };

  const { maxWidth, maxHeight } = getAvailableSpace();

  return (
    <View style={styles.simpleContainer}>
      <ZoomableImage
        source={{ uri: afterImage }}
        showLabel="Image transformée"
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        containerStyle={styles.imageContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  simpleContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    // AdaptiveImage gère déjà les styles de base
    backgroundColor: 'transparent', // Pas de fond gris sur fond noir
  },
});