
import { useState, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import imageService from '../services/imageService';

export const useCamera = () => {
  const { setOriginalImage, setError } = useAppContext();
  const [isCapturing, setIsCapturing] = useState(false);

  const capturePhoto = useCallback(async () => {
    setIsCapturing(true);
    setError(null);

    try {
      const uri = await imageService.capturePhoto();
      if (uri) {
        setOriginalImage(uri);
        return true;
      }
      return false;
    } catch (error) {
      setError('Erreur lors de la capture photo');
      return false;
    } finally {
      setIsCapturing(false);
    }
  }, [setOriginalImage, setError]);

  const pickFromGallery = useCallback(async () => {
    console.log('🖼️ pickFromGallery: Starting gallery picker');
    setIsCapturing(true);
    setError(null);

    try {
      const uri = await imageService.pickImage();
      console.log('🖼️ pickFromGallery: Image URI received:', uri ? 'SUCCESS' : 'CANCELLED');
      
      if (uri) {
        setOriginalImage(uri);
        console.log('🖼️ pickFromGallery: Image set in context');
        return true;
      }
      console.log('🖼️ pickFromGallery: No image selected (user cancelled)');
      return false;
    } catch (error) {
      console.error('🖼️ pickFromGallery: Error:', error);
      setError('Erreur lors de la sélection');
      return false;
    } finally {
      setIsCapturing(false);
      console.log('🖼️ pickFromGallery: Process completed');
    }
  }, [setOriginalImage, setError]);

  return {
    capturePhoto,
    pickFromGallery,
    isCapturing,
  };
};