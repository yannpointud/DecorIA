
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

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeImage,
  afterImage,
}) => {
  // Afficher seulement l'image transformée par défaut
  return (
    <View style={styles.simpleContainer}>
      <Image source={{ uri: afterImage }} style={styles.simpleImage} />
      <Text style={styles.simpleLabel}>Image transformée</Text>
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
  simpleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  simpleLabel: {
    position: 'absolute',
    top: 20,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
});