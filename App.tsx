// App.tsx

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/contexts/AppContext';
import { theme } from './src/constants/theme';
import { CameraScreen } from './src/screens/CameraScreen';
import { TransformScreen } from './src/screens/TransformScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import imageService from './src/services/imageService';

// Type pour la navigation
export type RootStackParamList = {
  Camera: undefined;
  Transform: undefined;
  Result: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  // Demander les permissions au démarrage
  useEffect(() => {
    const requestInitialPermissions = async () => {
      await imageService.requestPermissions();
    };
    requestInitialPermissions();

    // Nettoyer le cache au démarrage
    imageService.cleanCache();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator
              initialRouteName="Camera"
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
              }}
            >
              <Stack.Screen 
                name="Camera" 
                component={CameraScreen}
                options={{
                  title: 'Capture',
                }}
              />
              <Stack.Screen 
                name="Transform" 
                component={TransformScreen}
                options={{
                  title: 'Transformation',
                }}
              />
              <Stack.Screen 
                name="Result" 
                component={ResultScreen}
                options={{
                  title: 'Résultat',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}