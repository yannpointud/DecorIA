import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  Text,
} from 'react-native';
import { IMAGE_DIMENSIONS, getImageOrientation, getAdaptedDimensions } from '../constants/dimensions';

interface AdaptiveImageProps {
  source: { uri: string };
  maxWidth?: number;
  maxHeight?: number;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  showLabel?: string;
  showDimensions?: boolean; // Debug: afficher les dimensions calculées
}

interface ImageDimensions {
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait' | 'square';
}

export const AdaptiveImage: React.FC<AdaptiveImageProps> = ({
  source,
  maxWidth = IMAGE_DIMENSIONS.PREVIEW_MAX_WIDTH,
  maxHeight = IMAGE_DIMENSIONS.PREVIEW_MAX_HEIGHT,
  containerStyle,
  imageStyle,
  showLabel,
  showDimensions = false,
}) => {
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Analyser les dimensions de l'image
  useEffect(() => {
    if (!source?.uri) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    Image.getSize(
      source.uri,
      (width, height) => {
        const orientation = getImageOrientation(width, height);
        setImageDimensions({ width, height, orientation });
        setLoading(false);
        
        if (showDimensions) {
          console.log(`📐 AdaptiveImage: ${width}x${height} (${orientation})`);
        }
      },
      (error) => {
        console.error('Error getting image size:', error);
        setError(true);
        setLoading(false);
      }
    );
  }, [source.uri, showDimensions]);

  // Calculer les dimensions adaptées
  const getContainerDimensions = (): { width: number; height: number } => {
    if (!imageDimensions) {
      // Dimensions par défaut pendant le chargement
      return { width: maxWidth, height: maxHeight };
    }

    return getAdaptedDimensions(
      imageDimensions.width,
      imageDimensions.height,
      maxWidth,
      maxHeight
    );
  };

  const containerDimensions = getContainerDimensions();

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, containerStyle]}>
        <Text style={styles.errorText}>Erreur image</Text>
      </View>
    );
  }

  return (
    <View 
      style={[
        styles.container,
        {
          width: containerDimensions.width,
          height: containerDimensions.height,
        },
        containerStyle,
      ]}
    >
      <Image
        source={source}
        style={[
          styles.image,
          imageStyle,
        ]}
        resizeMode="contain"
      />
      
      {/* Label optionnel */}
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{showLabel}</Text>
        </View>
      )}
      
      {/* Debug: dimensions */}
      {showDimensions && imageDimensions && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            {imageDimensions.width}x{imageDimensions.height}
          </Text>
          <Text style={styles.debugText}>
            {imageDimensions.orientation}
          </Text>
        </View>
      )}
      
      {/* Indicateur de chargement */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
  },
  labelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  debugContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,0,0,0.8)',
    padding: 4,
    borderRadius: 4,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245,245,245,0.8)',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
});