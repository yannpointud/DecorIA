
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useOrientation } from '../hooks/useOrientation';
import { ImageComparison } from '../components/ImageComparison';
import { LoadingOverlay } from '../components/LoadingOverlay';
import imageService from '../services/imageService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { 
    originalImage, 
    transformedImage, 
    resetState, 
    retryTransformation, 
    isLoading, 
    loadingProgress 
  } = useAppContext();
  const { isLandscape } = useOrientation();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleSave = async () => {
    if (!transformedImage) return;
    
    const saved = await imageService.saveToGallery(transformedImage);
    if (saved) {
      // Success message shown by service
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const success = await retryTransformation();
      if (!success) {
        // Error is handled by context, just stay on screen
        console.log('Retry failed, staying on result screen');
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const handleNewPhoto = () => {
    resetState();
    navigation.navigate('Home');
  };


  // Vérifier les images et naviguer si nécessaire dans useEffect
  useEffect(() => {
    if (!originalImage || !transformedImage) {
      // Should not happen, but handle gracefully
      navigation.navigate('Home');
    }
  }, [originalImage, transformedImage, navigation]);

  if (!originalImage || !transformedImage) {
    return null; // Affichage temporaire pendant la navigation
  }

  return (
    <View style={styles.container}>
      {!isLandscape && (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Résultat" />
        </Appbar.Header>
      )}

      <ImageComparison
        beforeImage={originalImage}
        afterImage={transformedImage}
      />

      {/* Bouton retour flottant - toujours visible */}
      <TouchableOpacity 
        style={styles.floatingBackButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>

      {/* Bouton appareil photo - haut droite */}
      <TouchableOpacity 
        style={styles.floatingCameraButton} 
        onPress={handleNewPhoto}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="camera" size={24} color="#333" />
      </TouchableOpacity>

      {/* Bouton télécharger - bas gauche */}
      <TouchableOpacity 
        style={styles.floatingDownloadButton} 
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="download" size={24} color="#333" />
      </TouchableOpacity>

      {/* Bouton retry - bas droite */}
      <TouchableOpacity 
        style={styles.floatingRetryButton} 
        onPress={handleRetry}
        activeOpacity={0.8}
        disabled={isLoading || isRetrying}
      >
        <MaterialCommunityIcons 
          name="refresh" 
          size={24} 
          color={isLoading || isRetrying ? "#999" : "#333"} 
        />
      </TouchableOpacity>

      {/* Loading overlay pour retry */}
      <LoadingOverlay
        visible={isLoading || isRetrying}
        progress={loadingProgress}
        message="Nouvelle transformation..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  floatingBackButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 10,
  },
  floatingCameraButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 10,
  },
  floatingDownloadButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 10,
  },
  floatingRetryButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 10,
  },
});