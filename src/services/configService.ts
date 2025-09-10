import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';

interface ApiConfig {
  apiKey: string;
  apiUrl: string;
}

class ConfigService {
  private readonly CONFIG_KEY = '@DecorIA:apiConfig';
  private cache: ApiConfig | null = null;

  /**
   * Récupère la clé API selon la priorité :
   * 1. AsyncStorage (modifications utilisateur)
   * 2. .env (en mode dev)
   * 3. 'TEST_MODE' (en mode prod par défaut)
   */
  async getApiKey(): Promise<string> {
    const config = await this.getConfig();
    return config.apiKey;
  }

  /**
   * Récupère l'URL API selon la priorité :
   * 1. AsyncStorage (modifications utilisateur)
   * 2. .env (en mode dev)  
   * 3. URL par défaut Gemini 2.5 flash (en mode prod)
   */
  async getApiUrl(): Promise<string> {
    const config = await this.getConfig();
    return config.apiUrl;
  }

  /**
   * Récupère la configuration complète avec cache
   */
  private async getConfig(): Promise<ApiConfig> {
    if (this.cache) {
      return this.cache;
    }

    try {
      // Étape 1: Vérifier AsyncStorage (modifications utilisateur)
      const storedConfigJson = await AsyncStorage.getItem(this.CONFIG_KEY);
      if (storedConfigJson) {
        const storedConfig = JSON.parse(storedConfigJson);
        this.cache = {
          apiKey: storedConfig.apiKey || this.getDefaultApiKey(),
          apiUrl: storedConfig.apiUrl || this.getDefaultApiUrl(),
        };
        return this.cache;
      }

      // Étape 2: Utiliser les valeurs par défaut selon le mode
      this.cache = {
        apiKey: this.getDefaultApiKey(),
        apiUrl: this.getDefaultApiUrl(),
      };

      return this.cache;
    } catch (error) {
      console.error('Error getting config:', error);
      // Fallback sécurisé
      return {
        apiKey: 'TEST_MODE',
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
      };
    }
  }

  /**
   * Sauvegarde une nouvelle configuration
   */
  async saveConfig(apiKey: string, apiUrl: string): Promise<void> {
    try {
      const config = { apiKey, apiUrl };
      await AsyncStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
      
      // Invalider le cache pour forcer le rechargement
      this.cache = null;
      
      console.log('Configuration saved:', { apiKey: '***', apiUrl });
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  }

  /**
   * Récupère les valeurs par défaut pour l'affichage dans l'interface
   * (utilisé pour pré-remplir les champs dans SettingsScreen)
   */
  async getDefaultValuesForDisplay(): Promise<ApiConfig> {
    return {
      apiKey: this.getDefaultApiKey(),
      apiUrl: this.getDefaultApiUrl(),
    };
  }

  /**
   * Remet à zéro la configuration (revient aux valeurs par défaut)
   */
  async resetConfig(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CONFIG_KEY);
      this.cache = null;
      console.log('Configuration reset to defaults');
    } catch (error) {
      console.error('Error resetting config:', error);
      throw error;
    }
  }

  /**
   * Invalide le cache (utile après modification)
   */
  invalidateCache(): void {
    this.cache = null;
  }

  /**
   * Valeurs par défaut selon le mode d'exécution
   */
  private getDefaultApiKey(): string {
    if (__DEV__) {
      // Mode développement : utilise .env si disponible
      return API_CONFIG.GEMINI_API_KEY || 'TEST_MODE';
    }
    // Mode production : toujours TEST_MODE par défaut
    return 'TEST_MODE';
  }

  private getDefaultApiUrl(): string {
    if (__DEV__) {
      // Mode développement : utilise .env si disponible
      return API_CONFIG.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';
    }
    // Mode production : URL par défaut
    return 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';
  }
}

export default new ConfigService();