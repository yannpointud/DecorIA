import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Title, 
  Paragraph,
  Chip 
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../constants/theme';
import configService from '../services/configService';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDev] = useState(__DEV__);

  useEffect(() => {
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer les valeurs actuelles (priorité aux AsyncStorage puis defaults)
      const currentApiKey = await configService.getApiKey();
      const currentApiUrl = await configService.getApiUrl();
      
      setApiKey(currentApiKey);
      setApiUrl(currentApiUrl);
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Erreur', 'Impossible de charger les paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation basique
    if (!apiKey.trim()) {
      Alert.alert('Erreur', 'La clé API ne peut pas être vide');
      return;
    }

    if (!apiUrl.trim()) {
      Alert.alert('Erreur', 'L\'URL API ne peut pas être vide');
      return;
    }

    // Validation de l'URL
    try {
      new URL(apiUrl);
    } catch {
      Alert.alert('Erreur', 'L\'URL API n\'est pas valide');
      return;
    }

    try {
      setIsSaving(true);
      await configService.saveConfig(apiKey.trim(), apiUrl.trim());
      
      Alert.alert(
        'Succès', 
        'Paramètres sauvegardés avec succès',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Remettre à zéro',
      'Voulez-vous vraiment remettre les paramètres par défaut ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Remettre à zéro', style: 'destructive', onPress: performReset }
      ]
    );
  };

  const performReset = async () => {
    try {
      setIsSaving(true);
      await configService.resetConfig();
      await loadCurrentSettings(); // Recharger les valeurs par défaut
      Alert.alert('Succès', 'Paramètres remis à zéro');
    } catch (error) {
      console.error('Error resetting settings:', error);
      Alert.alert('Erreur', 'Impossible de remettre à zéro');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement des paramètres...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Title style={styles.headerTitle}>Paramètres API</Title>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Indicateur du mode */}
        <View style={styles.modeContainer}>
          <Chip 
            mode="outlined" 
            icon={isDev ? "dev-to" : "cellphone"} 
            style={[styles.modeChip, isDev ? styles.devChip : styles.prodChip]}
          >
            {isDev ? 'Mode Développement' : 'Mode Production'}
          </Chip>
        </View>

        {/* Description */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Configuration de l'API Gemini</Text>
          <Text style={styles.description}>
            {isDev 
              ? "En mode développement, les valeurs par défaut proviennent du fichier .env. Vous pouvez les modifier ici pour tester différentes configurations."
              : "Configurez votre clé API Gemini et l'URL du service pour utiliser DecorIA avec vos propres paramètres."
            }
          </Text>
        </View>

        {/* Champs de configuration */}
        <View style={styles.formContainer}>
          
          {/* Clé API */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Clé API Gemini</Text>
            <TextInput
              mode="outlined"
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Entrez votre clé API Gemini"
              secureTextEntry={apiKey !== 'TEST_MODE'}
              style={styles.textInput}
              disabled={isSaving}
              right={
                <TextInput.Icon 
                  icon={apiKey === 'TEST_MODE' ? "test-tube" : "key"} 
                />
              }
            />
            {apiKey === 'TEST_MODE' && (
              <Text style={styles.testModeWarning}>
                ⚠️ Mode démo actif - les transformations utiliseront des images factices
              </Text>
            )}
          </View>

          {/* URL API */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>URL de l'API Gemini</Text>
            <TextInput
              mode="outlined"
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="URL du service Gemini"
              keyboardType="url"
              autoCapitalize="none"
              style={styles.textInput}
              disabled={isSaving}
              right={<TextInput.Icon icon="link" />}
            />
          </View>

        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons 
              name="content-save" 
              size={24} 
              color="#6B7280" 
            />
            <Text style={styles.buttonText}>
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleReset}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons 
              name="restore" 
              size={24} 
              color="#6B7280" 
            />
            <Text style={styles.buttonText}>Valeurs par défaut</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  modeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modeChip: {
    marginBottom: 8,
  },
  devChip: {
    backgroundColor: '#e3f2fd',
  },
  prodChip: {
    backgroundColor: '#f3e5f5',
  },
  infoCard: {
    marginBottom: 24,
    backgroundColor: '#E8F4FD',
    borderWidth: 1,
    borderColor: '#4A9EF1',
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginTop: 8,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.text,
  },
  textInput: {
    backgroundColor: 'white',
  },
  testModeWarning: {
    fontSize: 12,
    color: '#ff9800',
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionsContainer: {
    gap: 20,
    marginBottom: 40,
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
  saveButton: {
    backgroundColor: '#E8F4FD',
    borderWidth: 1,
    borderColor: '#4A9EF1',
  },
  resetButton: {
    backgroundColor: '#E8F7F7',
    borderWidth: 1,
    borderColor: '#7FC4C7',
  },
  buttonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});