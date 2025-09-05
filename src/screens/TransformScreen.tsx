
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useImageTransform } from '../hooks/useImageTransform';
import { StyleCard } from '../components/StyleCard';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { TRANSFORMATION_STYLES } from '../constants/styles';

const { width: screenWidth } = Dimensions.get('window');

export const TransformScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    originalImage,
    selectedStyle,
    setSelectedStyle,
    isLoading,
    loadingProgress,
    error,
  } = useAppContext();
  const { transformImage, mockTransform } = useImageTransform();
  const [useMockApi, setUseMockApi] = useState(false); // Use real API by default

  useEffect(() => {
    if (!originalImage) {
      navigation.navigate('Camera');
    }
  }, [originalImage, navigation]);

  const handleTransform = async () => {
    console.log('handleTransform called');
    console.log('isLoading before:', isLoading);
    console.log('selectedStyle:', selectedStyle);
    console.log('useMockApi:', useMockApi);
    
    if (!selectedStyle) {
      Alert.alert('Attention', 'Veuillez sélectionner un style');
      return;
    }

    const success = useMockApi 
      ? await mockTransform()
      : await transformImage();

    console.log('isLoading after transform:', isLoading);
    console.log('transform success:', success);

    if (success) {
      navigation.navigate('Result');
    }
  };

  const handleRetake = () => {
    navigation.navigate('Camera');
  };

  if (!originalImage) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Choisir un style" />
        <Appbar.Action 
          icon="camera" 
          onPress={handleRetake}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: originalImage }} style={styles.previewImage} />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageLabel}>Photo originale</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Sélectionnez un style :</Text>

        <View style={styles.stylesGrid}>
          {TRANSFORMATION_STYLES.map((style) => (
            <StyleCard
              key={style.id}
              style={style}
              selected={selectedStyle?.id === style.id}
              onPress={() => setSelectedStyle(style)}
            />
          ))}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleTransform}
            disabled={!selectedStyle || isLoading}
            style={styles.transformButton}
            contentStyle={styles.transformButtonContent}
            loading={isLoading}
          >
            {isLoading ? 'Transformation...' : 'Transformer'}
          </Button>
        </View>
      </ScrollView>

      <LoadingOverlay
        visible={isLoading}
        progress={loadingProgress}
        message="Transformation en cours..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
  },
  imageLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    color: '#333',
  },
  stylesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  buttonContainer: {
    padding: 16,
    marginTop: 16,
  },
  transformButton: {
    borderRadius: 25,
  },
  transformButtonContent: {
    paddingVertical: 8,
  },
});