import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  Text,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';
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

  // Animation values for zoom and pan
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

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

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      
      // Limit zoom scale
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
        // Reset translation when zooming out to 1x
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else if (scale.value > 5) {
        scale.value = withSpring(5);
        savedScale.value = 5;
      }
      
      // Clamp translation to new scale bounds
      if (scale.value > 1) {
        const scaledImageWidth = displayDimensions.width * scale.value;
        const scaledImageHeight = displayDimensions.height * scale.value;
        
        const maxTranslateX = Math.max(0, (scaledImageWidth - maxWidth) / 2);
        const maxTranslateY = Math.max(0, (scaledImageHeight - maxHeight) / 2);
        
        const clampedX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX.value));
        const clampedY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY.value));
        
        if (clampedX !== translateX.value || clampedY !== translateY.value) {
          translateX.value = withSpring(clampedX);
          translateY.value = withSpring(clampedY);
          savedTranslateX.value = clampedX;
          savedTranslateY.value = clampedY;
        }
      }
    });


  // Pan gesture for dragging when zoomed
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (savedScale.value > 1) {
        const newX = savedTranslateX.value + event.translationX;
        const newY = savedTranslateY.value + event.translationY;
        
        // Calculate bounds and clamp immediately during movement
        const scaledImageWidth = displayDimensions.width * savedScale.value;
        const scaledImageHeight = displayDimensions.height * savedScale.value;
        
        const maxTranslateX = Math.max(0, (scaledImageWidth - maxWidth) / 2);
        const maxTranslateY = Math.max(0, (scaledImageHeight - maxHeight) / 2);
        
        // Hard clamp - image stops at boundaries
        translateX.value = Math.max(-maxTranslateX, Math.min(maxTranslateX, newX));
        translateY.value = Math.max(-maxTranslateY, Math.min(maxTranslateY, newY));
      }
    })
    .onEnd(() => {
      // Just save the final position - no spring animation needed
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Double tap to reset or zoom
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value > 1) {
        // Reset to original size
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        // Zoom to 3x
        scale.value = withSpring(3);
        savedScale.value = 3;
      }
    });

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

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
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture)}>
        <Animated.View style={[styles.gestureContainer, animatedStyle]}>
          <Image
            source={source}
            style={{
              width: displayDimensions.width,
              height: displayDimensions.height,
            }}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>

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
  gestureContainer: {
    flex: 1,
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