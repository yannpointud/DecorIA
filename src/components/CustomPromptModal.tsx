import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { Modal, Portal, Card, Button, Text, TextInput } from 'react-native-paper';

interface CustomPromptModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (customPrompt: string) => void;
  isLoading?: boolean;
}

export const CustomPromptModal: React.FC<CustomPromptModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
  isLoading = false,
}) => {
  const [prompt, setPrompt] = useState('');
  const textInputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    if (visible) {
      setPrompt('');
      // Focus sur le TextInput après l'ouverture de la modal
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  const handleConfirm = () => {
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt) {
      // Le préfixe sera ajouté automatiquement dans le service Gemini
      onConfirm(trimmedPrompt);
    }
  };

  const handleCancel = () => {
    setPrompt('');
    onDismiss();
  };

  const isValidPrompt = () => {
    const trimmedPrompt = prompt.trim();
    return trimmedPrompt.length > 0;
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modalContainer}
        style={styles.modal}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Transformation personnalisée
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Décrivez comment vous souhaitez transformer cette pièce :
            </Text>
            
            <TextInput
              ref={textInputRef}
              mode="outlined"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={3}
              style={styles.textInput}
              placeholder=""
              autoFocus
              disabled={isLoading}
            />
          </Card.Content>

          <Card.Actions style={styles.actions}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              disabled={isLoading}
              style={styles.cancelButton}
              textColor="#6B7280"
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleConfirm}
              disabled={!isValidPrompt() || isLoading}
              loading={isLoading}
              style={styles.confirmButton}
            >
              {isLoading ? 'Transformation...' : 'Transformer'}
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#F8F9FA',
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 0,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#6B7280',
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  textInput: {
    marginBottom: 16,
    minHeight: 80,
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
});