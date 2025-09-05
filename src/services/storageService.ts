
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TransformationHistory {
  id: string;
  originalImage: string;
  transformedImage: string;
  style: string;
  timestamp: number;
}

class StorageService {
  private readonly HISTORY_KEY = '@DecorIA:history';
  private readonly SETTINGS_KEY = '@DecorIA:settings';
  private readonly MAX_HISTORY_SIZE = 20;

  /**
   * Sauvegarde une transformation dans l'historique
   */
  async saveTransformation(
    originalImage: string,
    transformedImage: string,
    style: string
  ): Promise<void> {
    try {
      const history = await this.getHistory();
      const newEntry: TransformationHistory = {
        id: Date.now().toString(),
        originalImage,
        transformedImage,
        style,
        timestamp: Date.now(),
      };

      // Ajouter en début et limiter la taille
      const updatedHistory = [newEntry, ...history].slice(0, this.MAX_HISTORY_SIZE);
      
      await AsyncStorage.setItem(this.HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving transformation:', error);
    }
  }

  /**
   * Récupère l'historique des transformations
   */
  async getHistory(): Promise<TransformationHistory[]> {
    try {
      const historyJson = await AsyncStorage.getItem(this.HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  /**
   * Supprime une entrée de l'historique
   */
  async deleteFromHistory(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const updatedHistory = history.filter(item => item.id !== id);
      await AsyncStorage.setItem(this.HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error deleting from history:', error);
    }
  }

  /**
   * Efface tout l'historique
   */
  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  /**
   * Sauvegarde les préférences utilisateur
   */
  async saveSettings(settings: Record<string, any>): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Récupère les préférences utilisateur
   */
  async getSettings(): Promise<Record<string, any>> {
    try {
      const settingsJson = await AsyncStorage.getItem(this.SETTINGS_KEY);
      return settingsJson ? JSON.parse(settingsJson) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }
}

export default new StorageService();