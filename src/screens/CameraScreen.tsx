
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  BackHandler,
  Dimensions,
} from 'react-native';

import { CameraView, useCameraPermissions, CameraRatio } from 'expo-camera';

import { IconButton } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useCamera } from '../hooks/useCamera';
import { useOrientation } from '../hooks/useOrientation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const CameraScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const cameraRef = useRef<CameraView>(null);
  const { setOriginalImage, setCaptureAspectRatio } = useAppContext();
  const { pickFromGallery } = useCamera();
  const { isLandscape } = useOrientation();
  const isFocused = useIsFocused();
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<CameraRatio | null>(null); // Par défaut Auto
  const [zoom, setZoom] = useState(0); // Zoom de 0 à 1 (0 = dézoom maximum)

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission === null) {
      requestPermission();
    } else {
      setHasPermission(permission.granted);
    }
  }, [permission]);

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        skipProcessing: false,
        shutterSound: false, // Désactive le son du déclencheur
      });
      
      setOriginalImage(photo.uri);
      setCaptureAspectRatio(aspectRatio || '4:3');
      navigation.navigate('Transform');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType((current) =>
      current === 'back' ? 'front' : 'back'
    );
  };

  const handleGalleryPick = async () => {
    const success = await pickFromGallery();
    if (success) {
      navigation.navigate('Transform');
    }
  };

  const handleClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      BackHandler.exitApp();
    }
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  // Obtenir les dimensions d'écran
  const screenDimensions = Dimensions.get('window');
  
  // Configuration des positions des boutons selon l'orientation
  const BUTTON_POSITIONS = {
    home: {
      portrait: { top: 50, left: 20 },
      landscape: { top: 50, left: 20 }
    },
    ratioSelector: {
      portrait: { top: 50, alignSelf: 'center' as const },
      landscape: { left: 20, top: Math.round(screenDimensions.height * 0.5 - 45) }
    },
    flip: {
      portrait: { top: 50, right: 20 },
      landscape: { bottom: 30, left: 20 }
    },
    gallery: {
      portrait: { bottom: 30, left: 20 },
      landscape: { bottom: 30, right: 20 }
    },
    capture: {
      portrait: { bottom: 30, alignSelf: 'center' as const },
      landscape: { right: 30, top: Math.round(screenDimensions.height * 0.5 - 35) }
    },
    zoom: {
      portrait: { bottom: 30, right: 20 },
      landscape: { top: 50, right: 30 }
    }
  };

  const getButtonStyle = (buttonName: keyof typeof BUTTON_POSITIONS) => {
    const position = BUTTON_POSITIONS[buttonName][isLandscape ? 'landscape' : 'portrait'];
    return position;
  };


  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Demande de permission caméra...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons name="camera-off" size={64} color="#999" />
        <Text style={styles.noPermissionText}>
          Pas d'accès à la caméra
        </Text>
        <TouchableOpacity style={styles.galleryButton} onPress={handleGalleryPick}>
          <Text style={styles.galleryButtonText}>
            Choisir une image
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={cameraType as any}
          ratio={aspectRatio || '4:3'}
          zoom={zoom}
        >
        {/* Bouton Home */}
        <IconButton
          icon="home"
          size={30}
          iconColor="white"
          onPress={handleHome}
          style={[styles.controlButton, { position: 'absolute', ...getButtonStyle('home') }]}
        />
        
        {/* Sélecteur de ratio */}
        <View style={[
          isLandscape ? styles.aspectRatioSelectorLandscape : styles.aspectRatioSelector, 
          { position: 'absolute', ...getButtonStyle('ratioSelector') }
        ]}>
          {[{ label: 'Auto', value: null }, { label: '16:9', value: '16:9' }, { label: '4:3', value: '4:3' }].map((ratio) => {
            const isSelected = ratio.value === aspectRatio;
            return (
              <TouchableOpacity
                key={ratio.label}
                style={[
                  styles.ratioButton,
                  isSelected && styles.ratioButtonSelected
                ]}
                onPress={() => setAspectRatio(ratio.value as CameraRatio | null)}
              >
                <Text style={[
                  styles.ratioButtonText,
                  isSelected && styles.ratioButtonTextSelected
                ]}>
                  {ratio.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Bouton Flip */}
        <IconButton
          icon="camera-flip"
          size={30}
          iconColor="white"
          onPress={toggleCameraType}
          style={[styles.controlButton, { position: 'absolute', ...getButtonStyle('flip') }]}
        />

        {/* Bouton Galerie */}
        <IconButton
          icon="image"
          size={30}
          iconColor="white"
          onPress={handleGalleryPick}
          style={[styles.controlButton, { position: 'absolute', ...getButtonStyle('gallery') }]}
        />
        
        {/* Bouton Capture */}
        <TouchableOpacity
          style={[styles.captureButton, isCapturing && styles.capturingButton, { position: 'absolute', ...getButtonStyle('capture') }]}
          onPress={takePicture}
          disabled={isCapturing}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        {/* Boutons zoom */}
        <View style={[styles.zoomContainer, { position: 'absolute', ...getButtonStyle('zoom') }]}>
          <TouchableOpacity 
            style={styles.zoomButton}
            onPress={() => setZoom(Math.min(1, zoom + 0.1))}
          >
            <Text style={styles.zoomButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.zoomButton}
            onPress={() => setZoom(Math.max(0, zoom - 0.1))}
          >
            <Text style={styles.zoomButtonText}>−</Text>
          </TouchableOpacity>
        </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    padding: 3,
  },
  capturingButton: {
    opacity: 0.5,
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
  },
  noPermissionText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
  },
  galleryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  galleryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  aspectRatioSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  aspectRatioSelectorLandscape: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  ratioButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 2,
    marginVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 32,
  },
  ratioButtonSelected: {
    backgroundColor: 'white',
  },
  ratioButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ratioButtonTextSelected: {
    color: 'black',
  },
  zoomContainer: {
    alignItems: 'center',
    width: 50,
    gap: 8,
  },
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  zoomButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 20,
  },
});