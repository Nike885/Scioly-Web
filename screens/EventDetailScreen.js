import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { eventDetails } from './EventData'; // Adjust path if needed
import { useTheme } from '../contexts/ThemeContext';

export default function EventDetailScreen({ route }) {
  const { eventName } = route.params;
  const event = eventDetails[eventName];
  const { colors, theme } = useTheme();

  if (!event) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Event not found</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          We couldn't find details for this event. Please check your navigation.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>{event.description}</Text>

      {event.resources && (
        <>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>🔗 Resources</Text>
          {event.resources.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.linkCard, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}
              onPress={() => Linking.openURL(link.url)}
            >
              <Text style={styles.linkIcon}>{link.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.linkText, { color: colors.primary }]}>{link.label}</Text>
                <Text style={[styles.linkDesc, { color: colors.textSecondary }]}>{link.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}

      {event.additional && event.additional.length > 0 && (
        <>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>📚 Event Details</Text>
          {event.additional.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
              <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{section.content}</Text>
            </View>
          ))}
        </>
      )}

      <Text style={[styles.footer, { color: colors.textSecondary }]}>📅 Last updated: 2025 Season</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linkIcon: { fontSize: 24, marginRight: 10 },
  linkText: { fontSize: 16, fontWeight: '600' },
  linkDesc: { fontSize: 14 },
  section: { marginVertical: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  sectionContent: { fontSize: 14, lineHeight: 20 },
  footer: {
    marginTop: 30,
    fontStyle: 'italic',
    fontSize: 13,
    textAlign: 'center',
  },
});