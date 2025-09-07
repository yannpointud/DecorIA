
import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { ImageComparison } from '../components/ImageComparison';
import imageService from '../services/imageService';

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { originalImage, transformedImage, resetState } = useAppContext();

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
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Résultat" />
      </Appbar.Header>

      <ImageComparison
        beforeImage={originalImage}
        afterImage={transformedImage}
      />

      <View style={styles.fabContainer}>
        <FAB
          icon="camera"
          label="Nouvelle photo"
          onPress={handleNewPhoto}
          style={[styles.fab, styles.leftFab]}
        />
        <FAB
          icon="refresh"
          label="Refaire"
          onPress={handleRetry}
          style={[styles.fab, styles.centerFab]}
        />
        <FAB
          icon="download"
          label="Sauvegarder"
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
});