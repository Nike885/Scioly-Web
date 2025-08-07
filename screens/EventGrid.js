import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { colors, font } from '../utils/theme';
import AnimatedCard from '../components/AnimatedCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function EventGrid({ navigation, data }) {
  const renderItem = ({ item, index }) => (
    <AnimatedCard
      onPress={() => navigation.navigate('EventDetail', { event: item })}
      style={[styles.card, { width: CARD_WIDTH }]}
      animationDelay={index * 80}
    >
      <Text style={styles.cardText}>{item.title}</Text>
    </AnimatedCard>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.title}
      numColumns={2}
      contentContainerStyle={styles.grid}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 12,
    paddingBottom: 32,
  },
  card: {
    margin: 8,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 0.5,
    borderColor: colors.primary,
    marginBottom: 8,
    backgroundColor: colors.card,
  },
  cardText: {
    fontSize: font.size.body + 1,
    textAlign: 'center',
    fontWeight: font.weight.semibold,
    color: colors.text,
    fontFamily: font.family,
    letterSpacing: 0.2,
  },
});