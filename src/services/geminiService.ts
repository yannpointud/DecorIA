// src/services/geminiService.ts

import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { API_CONFIG, IMAGE_CONFIG } from '../constants/config';
import { TransformationStyle } from '../constants/styles';
import configService from './configService';

interface GeminiRequest {
  contents: [{
    parts: Array<{
      text?: string;
      inline_data?: {
        mime_type: string;
        data: string;
      };
    }>;
  }];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

interface GeminiResponse {
  candidates: [{
    content: {
      parts: [{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }];
    };
  }];
}

class GeminiService {
  /**
   * Récupère la clé API depuis la configuration dynamique
   */
  private async getApiKey(): Promise<string> {
    return await configService.getApiKey();
  }

  /**
   * Récupère l'URL API depuis la configuration dynamique
   */
  private async getApiUrl(): Promise<string> {
    return await configService.getApiUrl();
  }

  /**
   * Compresse et prépare l'image pour l'envoi
   */
  private async prepareImage(imageUri: string): Promise<string> {
    try {
      // Sur web, l'image est déjà disponible comme blob/file
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        return await this.prepareImageWeb(imageUri);
      }

      // Version native (iOS/Android)
      // D'abord, obtenir les dimensions originales
      const originalInfo = await ImageManipulator.manipulateAsync(
        imageUri,
        [],
        { format: ImageManipulator.SaveFormat.JPEG }
      );

      // Calculer les nouvelles dimensions en préservant le ratio
      const { width: originalWidth, height: originalHeight } = originalInfo;
      const maxDimension = IMAGE_CONFIG.MAX_DIMENSION;

      let resizeConfig: any = [];

      // Redimensionner seulement si nécessaire
      if (originalWidth > maxDimension || originalHeight > maxDimension) {
        if (originalWidth >= originalHeight) {
          // Image horizontale ou carrée - limiter la largeur
          resizeConfig = [{ resize: { width: maxDimension } }];
        } else {
          // Image verticale - limiter la hauteur
          resizeConfig = [{ resize: { height: maxDimension } }];
        }
      }

      // Appliquer la transformation
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        resizeConfig,
        {
          compress: IMAGE_CONFIG.COMPRESSION_QUALITY,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      console.log(`Image resized: ${originalWidth}x${originalHeight} → ${manipulatedImage.width}x${manipulatedImage.height}`);

      // Convertir en base64
      const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return base64;
    } catch (error) {
      console.error('Error preparing image:', error);
      throw new Error('Échec de la préparation de l\'image');
    }
  }

  /**
   * Version web pour préparer l'image
   */
  private async prepareImageWeb(imageUri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new (window as any).Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = (document as any).createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Impossible d\'obtenir le contexte canvas'));
          return;
        }

        // Redimensionner si nécessaire en préservant le ratio
        const maxDimension = IMAGE_CONFIG.MAX_DIMENSION;
        
        let { width, height } = img;
        
        // Redimensionner seulement si nécessaire
        if (width > maxDimension || height > maxDimension) {
          const ratio = maxDimension / Math.max(width, height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        
        console.log(`Image resized (web): ${img.width}x${img.height} → ${width}x${height}`);
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir en base64
        const base64 = canvas.toDataURL('image/jpeg', IMAGE_CONFIG.COMPRESSION_QUALITY);
        const base64Data = base64.split(',')[1]; // Enlever le préfixe data:image/jpeg;base64,
        
        resolve(base64Data);
      };

      img.onerror = () => {
        reject(new Error('Échec du chargement de l\'image'));
      };

      img.src = imageUri;
    });
  }

  /**
   * Construit le prompt complet pour la transformation
   */
  private buildPrompt(style: TransformationStyle): string {
    let transformationPrompt = style.prompt;
    
    // Détecter si c'est un prompt personnalisé et ajouter le préfixe automatiquement
    if (style.id === 'custom') {
      transformationPrompt = `Transformes cette pièce en suivant ces instructions : ${style.prompt}`;
    }
    
    return `Generate a transformed image of this room. ${transformationPrompt}

CRITICALS requirements:
- Generate and return ONLY the transformed image
- Maintain the exact same perspective and camera angle
- Keep the same room dimensions and all architectural features
- Do not change the input aspect ratio - preserve the original image dimensions exactly
- Maintain the exact same camera viewpoint and framing as the input image
- Preserve natural lighting direction when possible
- Create a photorealistic transformation
- Do not provide text descriptions, only generate the image`;
  }

  /**
   * Transforme une image selon le style sélectionné
   */
  async transformImage(
    imageUri: string,
    style: TransformationStyle,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // Récupérer la configuration dynamique
    const apiKey = await this.getApiKey();
    const apiUrl = await this.getApiUrl();
    
    // Debug: afficher la clé API (masquée pour sécurité)
    console.log('API Key status:', apiKey ? `${apiKey.substring(0, 10)}...` : 'No key');
    
    // Si pas de vraie clé API, utiliser le mode mock
    if (apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'TEST_MODE' || !apiKey) {
      console.log('Using mock mode');
      if (onProgress) onProgress(1);
      return this.mockTransform(style);
    }
    
    console.log('Using real Gemini API');

    try {
      // Étape 1: Préparation de l'image (30%)
      if (onProgress) onProgress(0.3);
      const base64Image = await this.prepareImage(imageUri);

      // Étape 2: Construction de la requête (40%)
      if (onProgress) onProgress(0.4);
      const request: GeminiRequest = {
        contents: [{
          parts: [
            {
              text: this.buildPrompt(style)
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0,
          topP: 0.95,
          maxOutputTokens: 32768,
        }
      };

      // Étape 3: Appel API (60%)
      if (onProgress) onProgress(0.6);
      const response = await axios.post<GeminiResponse>(
        `${apiUrl}?key=${apiKey}`,
        request,
        {
          timeout: API_CONFIG.REQUEST_TIMEOUT,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Étape 4: Traitement de la réponse (80%)
      if (onProgress) onProgress(0.8);
      
      console.log('Full Gemini response:', JSON.stringify(response.data, null, 2));
      
      const candidate = response.data?.candidates?.[0];
      if (!candidate?.content?.parts?.[0]) {
        throw new Error('Invalid response from Gemini API');
      }

      // Chercher l'image dans toutes les parties de la réponse
      let generatedImageUrl: string | null = null;
      
      for (const part of candidate.content.parts) {
        console.log('Checking part:', JSON.stringify(part, null, 2));
        
        if (part.inlineData?.data) {
          // Image en base64 dans inlineData
          generatedImageUrl = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
          console.log('Found image in inlineData');
          break;
        } else if (part.text) {
          // Essayer d'extraire une URL ou base64 du texte
          const extractedUrl = this.extractImageFromResponse(part.text);
          if (extractedUrl) {
            generatedImageUrl = extractedUrl;
            console.log('Found image in text:', extractedUrl.substring(0, 50) + '...');
            break;
          }
        }
      }
      
      if (!generatedImageUrl) {
        console.error('No image found in any part of the response');
        throw new Error('No image data found in response');
      }

      // Étape 5: Finalisation (100%)
      if (onProgress) onProgress(1);
      
      return generatedImageUrl;
    } catch (error) {
      console.error('Gemini transformation error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('Limite de l\'API dépassée. Veuillez réessayer plus tard.');
        }
        if (error.response?.status === 401) {
          throw new Error('Clé API invalide. Vérifiez votre configuration.');
        }
        if (error.response?.status === 500) {
          throw new Error('Erreur serveur de l\'API Google. Réessayez dans quelques minutes.');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion et réessayez.');
        }
        if (error.message === 'Network Error') {
          throw new Error('Connexion réseau échouée. Vérifiez votre connexion internet et réessayez.');
        }
      }
      
      throw new Error('Échec de la transformation d\'image. Veuillez réessayer.');
    }
  }

  /**
   * Extrait l'URL de l'image de la réponse Gemini
   * Note: Ceci dépendra du format exact de la réponse de l'API
   */
  private extractImageFromResponse(responseText: string): string | null {
    if (!responseText) return null;
    
    console.log('Extracting image from text response (first 200 chars):', responseText.substring(0, 200));
    
    // Si c'est une URL directe
    if (responseText.startsWith('http')) {
      return responseText.trim();
    }
    
    // Si c'est du base64 complet
    if (responseText.includes('data:image')) {
      const base64Match = responseText.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
      if (base64Match) {
        return base64Match[0];
      }
    }
    
    // Essayer d'extraire une URL du texte
    const urlMatch = responseText.match(/https?:\/\/[^\s\)]+/);
    if (urlMatch) {
      return urlMatch[0];
    }
    
    // Vérifier si c'est du base64 brut (au moins 100 caractères valides)
    const cleanText = responseText.trim();
    if (cleanText.length > 100 && /^[A-Za-z0-9+/=]+$/.test(cleanText)) {
      console.log('Detected raw base64, length:', cleanText.length);
      return `data:image/jpeg;base64,${cleanText}`;
    }
    
    console.log('No image format detected in text response');
    return null;
  }

  /**
   * Méthode de test avec image factice
   */
  async mockTransform(_style: TransformationStyle): Promise<string> {
    // Simule un délai de traitement
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    // Retourne une image de test
    return 'https://picsum.photos/400/600';
  }
}

export default new GeminiService();