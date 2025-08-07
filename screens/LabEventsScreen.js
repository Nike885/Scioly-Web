// LabEventsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { font } from '../utils/theme';
import AnimatedCard from '../components/AnimatedCard';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function LabEventsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const labEvents = [
    { name: 'Anatomy & Physiology', icon: 'body-outline', color: colors.primary },
    { name: 'Chemistry Lab', icon: 'flask-outline', color: colors.secondary },
    { name: 'Circuit Lab', icon: 'flash-outline', color: '#FF6B9D' },
    { name: 'Codebusters', icon: 'code-outline', color: '#4ECDC4' },
    { name: 'Disease Detectives', icon: 'shield-outline', color: '#45B7D1' },
    { name: 'Experimental Design', icon: 'analytics-outline', color: '#96CEB4' },
    { name: 'Forensics', icon: 'search-outline', color: '#FFEAA7' },
    { name: 'Water Quality', icon: 'water-outline', color: '#DDA0DD' },
  ];

  const renderItem = ({ item, index }) => (
    <AnimatedCard
      onPress={() => navigation.navigate('EventDetail', { eventName: item.name })}
      style={[styles.card, { backgroundColor: item.color, width: CARD_WIDTH, borderColor: colors.primary }]}
      animationDelay={index * 80}
    >
      <Ionicons name={item.icon} size={38} color={colors.primary} style={styles.icon} />
      <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
    </AnimatedCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Lab Events</Text>
      <FlatList
        data={labEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: font.size.header,
    fontWeight: font.weight.bold,
    marginTop: 32,
    marginBottom: 8,
    alignSelf: 'center',
    fontFamily: font.family,
    letterSpacing: 0.5,
  },
  grid: {
    padding: 12,
    paddingBottom: 32,
  },
  card: {
    margin: 8,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    borderWidth: 0.5,
    marginBottom: 8,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: font.size.body + 1,
    textAlign: 'center',
    fontWeight: font.weight.semibold,
    fontFamily: font.family,
    letterSpacing: 0.2,
  },
});