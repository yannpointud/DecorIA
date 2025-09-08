
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
import { useOrientation } from '../hooks/useOrientation';
import { StyleCard } from '../components/StyleCard';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { AdaptiveImage } from '../components/AdaptiveImage';
import { TRANSFORMATION_STYLES } from '../constants/styles';

export const TransformScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isLandscape, dimensions } = useOrientation();
  const {
    originalImage,
    selectedStyle,
    setSelectedStyle,
    captureAspectRatio,
    isLoading,
    loadingProgress,
    error,
  } = useAppContext();
  const { transformImage, mockTransform } = useImageTransform();
  const [useMockApi, setUseMockApi] = useState(false); // Use real API by default
  const [localLoading, setLocalLoading] = useState(false); // Local state pour affichage immédiat
  const [smoothProgress, setSmoothProgress] = useState(0); // Animation fluide
  const [realProgress, setRealProgress] = useState(0); // Vrai progrès API

  useEffect(() => {
    if (!originalImage) {
      navigation.navigate('Camera');
    }
  }, [originalImage, navigation]);

  // Animation fluide du progrès
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    // Phases : 0% → 50% (jalons réels) → 50% → 90% (animation) → 90% → 100% (jalons finaux)
    if (realProgress >= 0.4 && realProgress < 0.8 && localLoading) {
      // Démarre l'animation fluide de 50% à 90% (remplace la longue attente API)
      if (smoothProgress < 0.5) {
        setSmoothProgress(0.5); // Force le départ à 50%
      }
      interval = setInterval(() => {
        setSmoothProgress(prev => {
          // Augmente de 5% toutes les secondes jusqu'à maximum 90%
          const newProgress = Math.min(prev + 0.05, 0.9);
          return newProgress;
        });
      }, 1000);
    } else if (realProgress >= 0.8) {
      // Quand l'API répond (80%+), mapper vers 90%+ et finir
      const mappedProgress = 0.9 + (realProgress - 0.8) * 0.5; // 80%→90%, 100%→100%
      setSmoothProgress(mappedProgress);
    } else if (realProgress < 0.4) {
      // Utilise le vrai progrès pour les phases initiales, mais mappé sur 0% → 50%
      const mappedInitialProgress = realProgress * 1.25; // 0%→0%, 30%→37.5%, 40%→50%
      setSmoothProgress(mappedInitialProgress);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [realProgress, localLoading]);

  // Sync avec le loadingProgress du contexte global
  useEffect(() => {
    setRealProgress(loadingProgress);
  }, [loadingProgress]);

  const handleTransform = async () => {
    console.log('🔥 handleTransform called');
    console.log('🔥 selectedStyle:', selectedStyle);
    console.log('🔥 useMockApi:', useMockApi);
    
    if (!selectedStyle) {
      Alert.alert('Attention', 'Veuillez sélectionner un style');
      return;
    }

    // Active le loading local IMMÉDIATEMENT (pas de délai React)
    setLocalLoading(true);
    setSmoothProgress(0);
    setRealProgress(0);
    
    try {
      const success = useMockApi 
        ? await mockTransform()
        : await transformImage();

      console.log('🔥 transform success:', success);

      if (success) {
        navigation.navigate('Result');
      }
    } finally {
      // Désactive le loading local
      setLocalLoading(false);
      setSmoothProgress(0);
      setRealProgress(0);
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

      <ScrollView contentContainerStyle={[
        styles.content,
        isLandscape && styles.contentLandscape
      ]}>
        {isLandscape ? (
          <View style={styles.landscapeContainer}>
            {/* Image à gauche */}
            <View style={styles.imageSection}>
              <AdaptiveImage
                source={{ uri: originalImage }}
                showLabel="Photo originale"
                containerStyle={styles.imageContainerLandscape}
              />
            </View>
            
            {/* Styles à droite */}
            <View style={styles.stylesSection}>
              <ScrollView style={styles.stylesScrollView}>
                <View style={styles.stylesGridLandscape}>
                  {TRANSFORMATION_STYLES.map((style) => {
                    // Calculer largeur pour 2 colonnes dans l'espace droit (50% de l'écran - padding)
                    const landscapeCardWidth = (dimensions.width * 0.5 - 64) / 2 - 6; // 50% écran - padding total / 2 colonnes - margin
                    return (
                      <StyleCard
                        key={style.id}
                        style={style}
                        selected={selectedStyle?.id === style.id}
                        onPress={() => setSelectedStyle(style)}
                        landscapeWidth={landscapeCardWidth}
                      />
                    );
                  })}
                </View>
                
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={() => {
                    console.log('🔥 BUTTON PRESSED!');
                    console.log('🔥 selectedStyle exists:', !!selectedStyle);
                    console.log('🔥 isLoading:', isLoading);
                    console.log('🔥 button disabled:', !selectedStyle || isLoading);
                    handleTransform();
                  }}
                  disabled={!selectedStyle || localLoading || isLoading}
                  style={styles.transformButton}
                  contentStyle={styles.transformButtonContent}
                  loading={localLoading || isLoading}
                >
                  {(localLoading || isLoading) ? 'Transformation...' : 'Transformer'}
                </Button>
              </View>
            </View>
          </View>
        ) : (
          // Layout portrait (actuel)
          <>
            <AdaptiveImage
              source={{ uri: originalImage }}
              showLabel="Photo originale"
              containerStyle={styles.imageContainer}
            />

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
                onPress={() => {
                  console.log('🔥 BUTTON PRESSED!');
                  console.log('🔥 selectedStyle exists:', !!selectedStyle);
                  console.log('🔥 isLoading:', isLoading);
                  console.log('🔥 button disabled:', !selectedStyle || isLoading);
                  handleTransform();
                }}
                disabled={!selectedStyle || localLoading || isLoading}
                style={styles.transformButton}
                contentStyle={styles.transformButtonContent}
                loading={localLoading || isLoading}
              >
                {(localLoading || isLoading) ? 'Transformation...' : 'Transformer'}
              </Button>
            </View>
          </>
        )}
      </ScrollView>

      <LoadingOverlay
        visible={localLoading || isLoading}
        progress={smoothProgress}
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
  contentLandscape: {
    paddingBottom: 0,
    flexGrow: 1,
  },
  landscapeContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  imageSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingRight: 0,
    paddingTop: 16,
  },
  stylesSection: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 12,
    paddingTop: 8,
    justifyContent: 'flex-start',
  },
  stylesScrollView: {
    flex: 1,
    marginBottom: 4,
  },
  imageContainer: {
    margin: 16,
  },
  imageContainerLandscape: {
    margin: 0,
    marginVertical: 0,
    marginHorizontal: 0,
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
  stylesGridLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
    marginTop: 0,
  },
  transformButton: {
    borderRadius: 25,
  },
  transformButtonContent: {
    paddingVertical: 8,
  },
});