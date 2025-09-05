import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Camera } from 'expo-camera';
import { Alert, Platform } from 'react-native';

class ImageService {
  /**
   * Demande les permissions nécessaires
   */
  async requestPermissions(): Promise<boolean> {
    try {
      // Permission caméra
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      
      // Permission galerie
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      
      if (cameraStatus.status !== 'granted' || mediaLibraryStatus.status !== 'granted') {
        Alert.alert(
          'Permissions requises',
          'DecorIA a besoin d\'accéder à votre caméra et galerie pour fonctionner.',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Réessayer', onPress: () => this.requestPermissions() }
          ]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Capture une photo depuis la caméra
   */
  async capturePhoto(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: false,
      });

      if (result.canceled) {
        return null;
      }

      return result.assets[0].uri;
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Erreur', 'Impossible de capturer la photo');
      return null;
    }
  }

  /**
   * Sélectionne une image depuis la galerie
   */
  async pickImage(): Promise<string | null> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: false,
      });

      if (result.canceled) {
        return null;
      }

      return result.assets[0].uri;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
      return null;
    }
  }

  /**
   * Sauvegarde une image dans la galerie
   */
  async saveToGallery(imageUri: string): Promise<boolean> {
    try {
      const hasPermission = await this.checkMediaLibraryPermission();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) return false;
      }

      // Si c'est une URL distante, télécharger d'abord
      let localUri = imageUri;
      if (imageUri.startsWith('http')) {
        const downloadPath = `${FileSystem.cacheDirectory}decoria_${Date.now()}.jpg`;
        const downloadResult = await FileSystem.downloadAsync(imageUri, downloadPath);
        localUri = downloadResult.uri;
      }

      // Sauvegarder dans la galerie
      const asset = await MediaLibrary.createAssetAsync(localUri);
      
      // Créer un album DecorIA si nécessaire
      const album = await MediaLibrary.getAlbumAsync('DecorIA');
      if (album === null) {
        await MediaLibrary.createAlbumAsync('DecorIA', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert('Succès', 'Image sauvegardée dans la galerie');
      return true;
    } catch (error) {
      console.error('Error saving to gallery:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'image');
      return false;
    }
  }

  /**
   * Vérifie les permissions de la galerie
   */
  private async checkMediaLibraryPermission(): Promise<boolean> {
    const { status } = await MediaLibrary.getPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Optimise une image pour l'affichage
   */
  async optimizeImageForDisplay(imageUri: string): Promise<string> {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: 1080,
            },
          },
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return manipulatedImage.uri;
    } catch (error) {
      console.error('Error optimizing image:', error);
      return imageUri; // Retourne l'image originale en cas d'erreur
    }
  }

  /**
   * Convertit une image base64 en URI locale
   */
  async base64ToUri(base64: string): Promise<string> {
    try {
      const filename = `${FileSystem.cacheDirectory}decoria_temp_${Date.now()}.jpg`;
      
      // Enlever le préfixe data:image si présent
      const cleanBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
      
      await FileSystem.writeAsStringAsync(filename, cleanBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return filename;
    } catch (error) {
      console.error('Error converting base64 to URI:', error);
      throw error;
    }
  }

  /**
   * Nettoie le cache temporaire
   */
  async cleanCache(): Promise<void> {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) return;

      const files = await FileSystem.readDirectoryAsync(cacheDir);
      const decoriaFiles = files.filter(file => file.startsWith('decoria_'));
      
      await Promise.all(
        decoriaFiles.map(file => 
          FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true })
        )
      );
    } catch (error) {
      console.error('Error cleaning cache:', error);
    }
  }
}

export default new ImageService();