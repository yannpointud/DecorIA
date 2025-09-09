import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useCamera } from '../hooks/useCamera';
import { useOrientation } from '../hooks/useOrientation';
import { theme } from '../constants/theme';
import { IMAGE_DIMENSIONS } from '../constants/dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { pickFromGallery } = useCamera();
  const { isLandscape } = useOrientation();

  const handleCameraPress = () => {
    navigation.navigate('Camera');
  };

  const handleGalleryPress = async () => {
    const success = await pickFromGallery();
    if (success) {
      navigation.navigate('Transform');
    }
  };

  return (
    <View style={styles.container}>
      {isLandscape ? (
        // Layout paysage : Logo+texte à gauche, boutons à droite
        <View style={styles.landscapeContent}>
          <View style={styles.leftSection}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/icon.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.subtitleLandscape}>Transformez vos pièces avec l'IA</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.cameraButton]}
                onPress={handleCameraPress}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons 
                  name="camera" 
                  size={24} 
                  color="#6B7280" 
                />
                <Text style={styles.buttonText}>Appareil Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.galleryButton]}
                onPress={handleGalleryPress}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons 
                  name="image" 
                  size={24} 
                  color="#6B7280" 
                />
                <Text style={styles.buttonText}>Galerie</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        // Layout portrait : Layout vertical original
        <View style={styles.centeredContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>Transformez vos pièces avec l'IA</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cameraButton]}
              onPress={handleCameraPress}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="camera" 
                size={24} 
                color="#6B7280" 
              />
              <Text style={styles.buttonText}>Appareil Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.galleryButton]}
              onPress={handleGalleryPress}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="image" 
                size={24} 
                color="#6B7280" 
              />
              <Text style={styles.buttonText}>Galerie</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>yann@pointud.fr - 2025</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landscapeContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: IMAGE_DIMENSIONS.LOGO_SIZE,
    height: IMAGE_DIMENSIONS.LOGO_SIZE,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 40,
  },
  subtitleLandscape: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 0,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: theme.roundness,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cameraButton: {
    backgroundColor: '#E8F4FD',
    borderWidth: 1,
    borderColor: '#4A9EF1',
  },
  galleryButton: {
    backgroundColor: '#E8F7F7',
    borderWidth: 1,
    borderColor: '#7FC4C7',
  },
  buttonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.disabled,
    opacity: 0.8,
  },
});