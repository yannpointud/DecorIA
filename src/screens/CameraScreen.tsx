
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';

import { Camera } from 'expo-camera';

import { IconButton, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useCamera } from '../hooks/useCamera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const CameraScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const cameraRef = useRef<Camera>(null);
  const { setOriginalImage } = useAppContext();
  const { pickFromGallery } = useCamera();
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState('back');
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        skipProcessing: false,
      });
      
      setOriginalImage(photo.uri);
      navigation.navigate('Transform');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType((current: string) =>
      current === 'back' ? 'front' : 'back'
    );
  };

  const handleGalleryPick = async () => {
    const success = await pickFromGallery();
    if (success) {
      navigation.navigate('Transform');
    }
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
      <Camera 
        ref={cameraRef}
        style={styles.camera} 
        type={cameraType}
        ratio="4:3"
      >
        <View style={styles.topControls}>
          <IconButton
            icon="close"
            size={30}
            iconColor="white"
            onPress={() => navigation.goBack()}
            style={styles.controlButton}
          />
          <IconButton
            icon="camera-flip"
            size={30}
            iconColor="white"
            onPress={toggleCameraType}
            style={styles.controlButton}
          />
        </View>

        <View style={styles.bottomControls}>
          <IconButton
            icon="image"
            size={30}
            iconColor="white"
            onPress={handleGalleryPick}
            style={styles.controlButton}
          />
          
          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.capturingButton]}
            onPress={takePicture}
            disabled={isCapturing}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <View style={{ width: 50 }} />
        </View>
      </Camera>
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
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
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
});