import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ViewStyle,
  Text,
  Dimensions,
} from 'react-native';
import { getImageOrientation, getAdaptedDimensions } from '../constants/dimensions';

interface ZoomableImageProps {
  source: { uri: string };
  maxWidth: number;
  maxHeight: number;
  containerStyle?: ViewStyle;
  showLabel?: string;
}

interface ImageDimensions {
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait' | 'square';
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  source,
  maxWidth,
  maxHeight,
  containerStyle,
  showLabel,
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
      },
      (error) => {
        console.error('Error getting image size:', error);
        setError(true);
        setLoading(false);
      }
    );
  }, [source.uri]);

  // Calculer les dimensions adaptées pour l'affichage initial
  const getDisplayDimensions = () => {
    if (!imageDimensions) {
      return { width: maxWidth, height: maxHeight };
    }

    return getAdaptedDimensions(
      imageDimensions.width,
      imageDimensions.height,
      maxWidth,
      maxHeight
    );
  };

  const displayDimensions = getDisplayDimensions();

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, { width: maxWidth, height: maxHeight }, containerStyle]}>
        <Text style={styles.errorText}>Erreur image</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { width: maxWidth, height: maxHeight }, containerStyle]}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: maxWidth, height: maxHeight }, containerStyle]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        maximumZoomScale={3}
        minimumZoomScale={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bouncesZoom={true}
        centerContent={true}
        pinchGestureEnabled={true}
        scrollEnabled={true}
      >
        <Image
          source={source}
          style={{
            width: displayDimensions.width,
            height: displayDimensions.height,
          }}
          resizeMode="contain"
        />
      </ScrollView>

      {/* Label optionnel */}
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{showLabel}</Text>
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
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
});