// src/services/geminiService.ts

import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { API_CONFIG, IMAGE_CONFIG } from '../constants/config';
import { TransformationStyle } from '../constants/styles';

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
    topK?: number;
    maxOutputTokens?: number;
  };
}

interface GeminiResponse {
  candidates: [{
    content: {
      parts: [{
        text: string;
      }];
    };
  }];
}

class GeminiService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = API_CONFIG.GEMINI_API_KEY;
    this.apiUrl = API_CONFIG.GEMINI_API_URL;
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
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: IMAGE_CONFIG.MAX_WIDTH,
              height: IMAGE_CONFIG.MAX_HEIGHT,
            },
          },
        ],
        {
          compress: IMAGE_CONFIG.COMPRESSION_QUALITY,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // Convertir en base64
      const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return base64;
    } catch (error) {
      console.error('Error preparing image:', error);
      throw new Error('Failed to prepare image for processing');
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
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Redimensionner si nécessaire
        const maxWidth = IMAGE_CONFIG.MAX_WIDTH;
        const maxHeight = IMAGE_CONFIG.MAX_HEIGHT;
        
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir en base64
        const base64 = canvas.toDataURL('image/jpeg', IMAGE_CONFIG.COMPRESSION_QUALITY);
        const base64Data = base64.split(',')[1]; // Enlever le préfixe data:image/jpeg;base64,
        
        resolve(base64Data);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = imageUri;
    });
  }

  /**
   * Construit le prompt complet pour la transformation
   */
  private buildPrompt(style: TransformationStyle): string {
    return `Generate a transformed image of this room. ${style.prompt}

Important requirements:
- Generate and return ONLY the transformed image
- Maintain the exact same perspective and camera angle
- Keep the same room dimensions and architectural features
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
    // Debug: afficher la clé API (masquée pour sécurité)
    console.log('API Key status:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'No key');
    
    // Si pas de vraie clé API, utiliser le mode mock
    if (this.apiKey === 'YOUR_API_KEY_HERE' || this.apiKey === 'TEST_MODE' || !this.apiKey) {
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
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192,
        }
      };

      // Étape 3: Appel API (60%)
      if (onProgress) onProgress(0.6);
      const response = await axios.post<GeminiResponse>(
        `${this.apiUrl}?key=${this.apiKey}`,
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

      const part = candidate.content.parts[0];
      
      // Pour un modèle de génération d'image, l'image peut être dans inlineData
      let generatedImageUrl: string;
      if (part.inlineData?.data) {
        // Image en base64 dans inlineData
        generatedImageUrl = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        // Fallback si l'image est dans text
        generatedImageUrl = this.extractImageFromResponse(part.text);
      } else {
        throw new Error('No image data found in response');
      }

      // Étape 5: Finalisation (100%)
      if (onProgress) onProgress(1);
      
      return generatedImageUrl;
    } catch (error) {
      console.error('Gemini transformation error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your configuration.');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout. Please check your connection and try again.');
        }
      }
      
      throw new Error('Failed to transform image. Please try again.');
    }
  }

  /**
   * Extrait l'URL de l'image de la réponse Gemini
   * Note: Ceci dépendra du format exact de la réponse de l'API
   */
  private extractImageFromResponse(responseText: string): string {
    // Pour le POC, on assume que Gemini retourne une URL ou base64
    // À adapter selon la vraie réponse de l'API
    
    // Si c'est une URL directe
    if (responseText.startsWith('http')) {
      return responseText;
    }
    
    // Si c'est du base64
    if (responseText.includes('data:image')) {
      return responseText;
    }
    
    // Essayer d'extraire une URL du texte
    const urlMatch = responseText.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      return urlMatch[0];
    }
    
    // Si c'est du base64 brut
    return `data:image/jpeg;base64,${responseText}`;
  }

  /**
   * Méthode de test avec image factice
   */
  async mockTransform(style: TransformationStyle): Promise<string> {
    // Simule un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retourne une image de test
    return 'https://picsum.photos/400/600';
  }
}

export default new GeminiService();