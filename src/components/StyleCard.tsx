
import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TransformationStyle } from '../constants/styles';

interface StyleCardProps {
  style: TransformationStyle;
  selected: boolean;
  onPress: () => void;
}

export const StyleCard: React.FC<StyleCardProps> = ({
  style,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={[styles.card, selected && styles.selectedCard]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: style.color },
            selected && styles.selectedIconContainer,
          ]}
        >
          <MaterialCommunityIcons
            name={style.icon as any}
            size={32}
            color="white"
          />
        </View>
        <Text style={[styles.title, selected && styles.selectedTitle]}>
          {style.name}
        </Text>
        <Text style={styles.description}>{style.description}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    margin: 8,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
    elevation: 6,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedTitle: {
    color: '#2196F3',
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});