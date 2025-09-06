import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Text,
  Dimensions,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { theme } from '../constants/theme';

interface LoadingOverlayProps {
  visible: boolean;
  progress?: number;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  progress = 0,
  message = 'Transformation en cours...',
}) => {
  console.log('🚀 LoadingOverlay render - visible:', visible, 'progress:', progress);
  if (!visible) return null;
  
  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.message}>{message}</Text>
        {progress > 0 && (
          <>
            <ProgressBar
              progress={progress}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 250,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  progressBar: {
    width: 200,
    height: 6,
    marginTop: 20,
    borderRadius: 3,
  },
  percentage: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});