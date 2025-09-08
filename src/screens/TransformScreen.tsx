
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useImageTransform } from '../hooks/useImageTransform';
import { useOrientation } from '../hooks/useOrientation';
import { StyleCard } from '../components/StyleCard';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { AdaptiveImage } from '../components/AdaptiveImage';
import { CustomPromptModal } from '../components/CustomPromptModal';
import { TRANSFORMATION_STYLES } from '../constants/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const TransformScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isLandscape, dimensions } = useOrientation();
  const {
    originalImage,
    selectedStyle,
    setSelectedStyle,
    isLoading,
    loadingProgress,
    error,
  } = useAppContext();
  const { transformImage, mockTransform } = useImageTransform();
  const [useMockApi] = useState(false); // Use real API by default
  const [localLoading, setLocalLoading] = useState(false); // Local state pour affichage immédiat
  const [smoothProgress, setSmoothProgress] = useState(0); // Animation fluide
  const [realProgress, setRealProgress] = useState(0); // Vrai progrès API
  const [showCustomModal, setShowCustomModal] = useState(false);

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

  const handleStyleSelect = (style: any) => {
    if (style.id === 'custom') {
      // Le style personnalisé ouvre directement la modal
      setShowCustomModal(true);
    } else {
      // Les autres styles sont sélectionnables normalement
      setSelectedStyle(style);
    }
  };

  const handleCustomPromptConfirm = async (customPrompt: string) => {
    const customStyle = TRANSFORMATION_STYLES.find(s => s.id === 'custom') || null;
    setShowCustomModal(false);
    
    // Transformation directe avec le prompt personnalisé
    if (customStyle) {
      console.log('🔥 Custom transform started');
      console.log('🔥 customPrompt:', customPrompt);
      
      // Active le loading local IMMÉDIATEMENT
      setLocalLoading(true);
      setSmoothProgress(0);
      setRealProgress(0);
      
      try {
        const success = useMockApi 
          ? await mockTransform(customStyle, customPrompt)
          : await transformImage(customStyle, customPrompt);

        console.log('🔥 custom transform success:', success);

        if (success) {
          navigation.navigate('Result');
        }
      } finally {
        // Désactive le loading local
        setLocalLoading(false);
        setSmoothProgress(0);
        setRealProgress(0);
      }
    }
  };

  const handleCustomPromptCancel = () => {
    setShowCustomModal(false);
  };

  if (!originalImage) {
    return null;
  }

  return (
    <View style={styles.container}>

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
                maxWidth={dimensions.width * 0.5 - 16} // 50% largeur écran pour paysage
                maxHeight={dimensions.height - 32} // Hauteur écran moins marges
                containerStyle={styles.imageContainerLandscape}
              />
              {/* Bouton retour flottant en paysage */}
              <TouchableOpacity 
                style={styles.floatingBackButton} 
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
              </TouchableOpacity>
              {/* Bouton caméra flottant sur l'image */}
              <TouchableOpacity 
                style={styles.floatingCameraButton} 
                onPress={handleRetake}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="camera" size={24} color="#333" />
              </TouchableOpacity>
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
                        selected={style.id !== 'custom' && selectedStyle?.id === style.id}
                        onPress={() => handleStyleSelect(style)}
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

              <View style={[styles.buttonContainer, isLandscape && styles.buttonContainerLandscape]}>
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
            <View style={styles.imageSection}>
              <AdaptiveImage
                source={{ uri: originalImage }}
                showLabel="Photo originale"
                maxWidth={dimensions.width - 16} // Largeur écran moins petite marge
                maxHeight={450} // Plus de hauteur que la valeur par défaut
                containerStyle={styles.imageContainer}
              />
              {/* Bouton retour flottant */}
              <TouchableOpacity 
                style={styles.floatingBackButton} 
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
              </TouchableOpacity>
              {/* Bouton caméra flottant sur l'image */}
              <TouchableOpacity 
                style={styles.floatingCameraButton} 
                onPress={handleRetake}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="camera" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.stylesGrid}>
              {TRANSFORMATION_STYLES.map((style) => (
                <StyleCard
                  key={style.id}
                  style={style}
                  selected={style.id !== 'custom' && selectedStyle?.id === style.id}
                  onPress={() => handleStyleSelect(style)}
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

      <CustomPromptModal
        visible={showCustomModal}
        onDismiss={handleCustomPromptCancel}
        onConfirm={handleCustomPromptConfirm}
        isLoading={localLoading || isLoading}
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
    marginTop: 30,
    paddingBottom: 20,
  },
  contentLandscape: {
    marginTop: 12,
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
    marginVertical: 16,
    marginHorizontal: 8, // Moins de marge latérale pour plus d'espace
    elevation: 8, // Ombre Android plus prononcée
    shadowColor: '#000', // Ombre iOS
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  imageContainerLandscape: {
    margin: 0,
    marginVertical: 0,
    marginHorizontal: 0,
    elevation: 8, // Ombre Android plus prononcée
    shadowColor: '#000', // Ombre iOS
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
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
  buttonContainerLandscape: {
    paddingTop: 8,
  },
  transformButton: {
    borderRadius: 25,
  },
  transformButtonContent: {
    paddingVertical: 8,
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
});