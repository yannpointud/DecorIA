
import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useOrientation } from '../hooks/useOrientation';
import { ImageComparison } from '../components/ImageComparison';
import imageService from '../services/imageService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { originalImage, transformedImage, resetState } = useAppContext();
  const { isLandscape } = useOrientation();

  const handleSave = async () => {
    if (!transformedImage) return;
    
    const saved = await imageService.saveToGallery(transformedImage);
    if (saved) {
      // Success message shown by service
    }
  };


  const handleNewPhoto = () => {
    resetState();
    navigation.navigate('Home');
  };

  const handleRetry = () => {
    navigation.navigate('Transform');
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

      {/* Bouton retour flottant en paysage */}
      {isLandscape && (
        <TouchableOpacity 
          style={styles.floatingBackButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
      )}

      <View style={styles.fabContainer}>
        <FAB
          icon="camera"
          onPress={handleNewPhoto}
          style={[styles.fab, styles.leftFab]}
        />
        <FAB
          icon="refresh"
          onPress={handleRetry}
          style={[styles.fab, styles.centerFab]}
        />
        <FAB
          icon="download"
          onPress={handleSave}
          style={[styles.fab, styles.rightFab]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingHorizontal: 10,
  },
  fab: {
    backgroundColor: '#2196F3',
  },
  leftFab: {
    marginRight: 5,
  },
  centerFab: {
    marginHorizontal: 5,
  },
  rightFab: {
    marginLeft: 5,
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
});