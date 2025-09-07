
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
import { AdaptiveImage } from './AdaptiveImage';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeImage,
  afterImage,
}) => {
  // Utiliser AdaptiveImage pour un affichage optimal
  return (
    <View style={styles.simpleContainer}>
      <AdaptiveImage
        source={{ uri: afterImage }}
        showLabel="Image transformée"
        maxWidth={screenWidth - 32}
        maxHeight={screenWidth * 1.2} // Permet images verticales
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