
import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TransformationStyle } from '../constants/styles';

interface StyleCardProps {
  style: TransformationStyle;
  selected: boolean;
  onPress: () => void;
  landscapeWidth?: number;
}

export const StyleCard: React.FC<StyleCardProps> = ({
  style,
  selected,
  onPress,
  landscapeWidth,
}) => {
  const isLandscape = !!landscapeWidth;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={[
        styles.card, 
        landscapeWidth ? { width: landscapeWidth, margin: 3, padding: 8 } : null,
        selected ? [styles.selectedCard, { borderColor: style.color }] : styles.unselectedCard
      ]}>
        <View style={styles.cardContent}>
          <View
            style={[
              isLandscape ? styles.iconContainerLandscape : styles.iconContainer,
              { backgroundColor: style.color },
              selected ? styles.selectedIconContainer : styles.unselectedIconContainer,
            ]}
          >
            <MaterialCommunityIcons
              name={style.icon as any}
              size={isLandscape ? 20 : 24}
              color="white"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[
              styles.title, 
              selected ? [styles.selectedTitle, { color: style.color }] : styles.title
            ]}>
              {style.name}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {style.description}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    margin: 6,
    padding: 12,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    elevation: 6,
    backgroundColor: '#f8f9fa',
  },
  unselectedCard: {
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerLandscape: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  unselectedIconContainer: {
    transform: [{ scale: 1.0 }],
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  selectedTitle: {
    fontWeight: '700',
  },
  description: {
    fontSize: 11,
    color: '#666',
    lineHeight: 14,
  },
});