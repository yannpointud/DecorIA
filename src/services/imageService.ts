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
        allowsEditing: true,  // Permet le recadrage libre
        // aspect: [4, 3],    // ✅ SUPPRIMÉ - Ratio libre
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

      // Convertir l'image en fichier local avec extension
      let localUri = imageUri;
      
      if (imageUri.startsWith('data:image')) {
        // Image base64 - convertir en fichier local
        console.log('💾 Converting base64 to local file...');
        localUri = await this.base64ToUri(imageUri);
      } else if (imageUri.startsWith('http')) {
        // URL distante - télécharger
        const downloadPath = `${FileSystem.cacheDirectory}decoria_${Date.now()}.jpg`;
        const downloadResult = await FileSystem.downloadAsync(imageUri, downloadPath);
        localUri = downloadResult.uri;
      }
      
      console.log('💾 Final localUri:', localUri);

      // Sauvegarder directement dans la galerie principale du téléphone
      const asset = await MediaLibrary.createAssetAsync(localUri);
      console.log('💾 Image saved to main gallery:', asset.uri);

      Alert.alert('Succès', 'Image sauvegardée dans vos Photos');
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
      // Utiliser les constantes unifiées pour l'optimisation
      const { IMAGE_CONFIG } = await import('../constants/config');
      
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: IMAGE_CONFIG.MAX_DIMENSION,
            },
          },
        ],
        {
          compress: IMAGE_CONFIG.COMPRESSION_QUALITY,
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
      
      console.log('💾 Writing base64 to file:', filename);
      console.log('💾 Base64 length:', cleanBase64.length);
      
      await FileSystem.writeAsStringAsync(filename, cleanBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('💾 File written successfully:', filename);
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